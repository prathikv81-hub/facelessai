import Text "mo:core/Text";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import VideoTypes "../types/videos";

module {
  // Generate a video script via OpenAI GPT-4o-mini.
  // In auto mode: generate script from prompt.
  // In userScript mode: use the provided script directly.
  public func generateScript(
    prompt : Text,
    mode : VideoTypes.GenerationMode,
    openAiKey : Text,
    transform : OutCall.Transform,
  ) : async Text {
    switch (mode) {
      case (#userScript({ script })) {
        script; // user-supplied script — use as-is
      };
      case (#auto) {
        let body = "{\"model\":\"gpt-4o-mini\",\"messages\":[{\"role\":\"system\",\"content\":\"You are a professional YouTube scriptwriter for faceless video content. Write engaging, informative scripts suitable for text-to-speech narration. Keep scripts between 200-400 words.\"},{\"role\":\"user\",\"content\":\"Write a YouTube script for a faceless video about: " # escapeJson(prompt) # "\"}],\"max_tokens\":800,\"temperature\":0.7}";
        let headers : [OutCall.Header] = [
          { name = "Authorization"; value = "Bearer " # openAiKey },
          { name = "Content-Type"; value = "application/json" },
        ];
        let response = await OutCall.httpPostRequest(
          "https://api.openai.com/v1/chat/completions",
          headers,
          body,
          transform,
        );
        // Return raw JSON — frontend parses; extract content field from response
        extractOpenAiContent(response);
      };
    };
  };

  // Generate voiceover audio via OpenAI TTS (alloy voice).
  // Returns a URL pointing to the audio data (base64 encoded JSON tunneled to frontend).
  public func generateVoiceover(
    script : Text,
    openAiKey : Text,
    transform : OutCall.Transform,
  ) : async Text {
    let body = "{\"model\":\"tts-1\",\"input\":\"" # escapeJson(script) # "\",\"voice\":\"alloy\",\"response_format\":\"mp3\"}";
    let headers : [OutCall.Header] = [
      { name = "Authorization"; value = "Bearer " # openAiKey },
      { name = "Content-Type"; value = "application/json" },
    ];
    await OutCall.httpPostRequest(
      "https://api.openai.com/v1/audio/speech",
      headers,
      body,
      transform,
    );
  };

  // Generate 3 images via DALL-E 3 based on script excerpts.
  // Returns array of image URLs from the OpenAI response JSON.
  public func generateImages(
    script : Text,
    prompt : Text,
    openAiKey : Text,
    transform : OutCall.Transform,
  ) : async [Text] {
    let imagePrompt = "Cinematic, professional photograph for a YouTube thumbnail representing: " # escapeJson(prompt) # ". Scene from script: " # escapeJson(truncate(script, 200));
    let body = "{\"model\":\"dall-e-3\",\"prompt\":\"" # imagePrompt # "\",\"n\":1,\"size\":\"1792x1024\",\"quality\":\"standard\"}";
    let headers : [OutCall.Header] = [
      { name = "Authorization"; value = "Bearer " # openAiKey },
      { name = "Content-Type"; value = "application/json" },
    ];
    // Generate 3 images sequentially (DALL-E 3 supports n=1 only per call)
    let img1 = await OutCall.httpPostRequest(
      "https://api.openai.com/v1/images/generations",
      headers,
      body,
      transform,
    );
    let img2 = await OutCall.httpPostRequest(
      "https://api.openai.com/v1/images/generations",
      headers,
      body,
      transform,
    );
    let img3 = await OutCall.httpPostRequest(
      "https://api.openai.com/v1/images/generations",
      headers,
      body,
      transform,
    );
    [img1, img2, img3];
  };

  // Assemble final video via Replicate (frame stitching from images + voiceover).
  // Returns the prediction response JSON for polling.
  public func assembleVideo(
    scriptText : Text,
    voiceoverRef : Text,
    imageRefs : [Text],
    replicateKey : Text,
    transform : OutCall.Transform,
  ) : async Text {
    let imagesJson = buildJsonArray(imageRefs);
    let body = "{\"version\":\"stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438\",\"input\":{\"images\":" # imagesJson # ",\"audio_url\":\"" # escapeJson(voiceoverRef) # "\",\"duration\":30,\"fps\":8,\"script\":\"" # escapeJson(truncate(scriptText, 500)) # "\"}}";
    let headers : [OutCall.Header] = [
      { name = "Authorization"; value = "Token " # replicateKey },
      { name = "Content-Type"; value = "application/json" },
    ];
    await OutCall.httpPostRequest(
      "https://api.replicate.com/v1/predictions",
      headers,
      body,
      transform,
    );
  };

  // Escape special JSON characters in a string.
  func escapeJson(s : Text) : Text {
    s
      .replace(#char '\\', "\\\\")
      .replace(#char '"', "\\\"")
      .replace(#char '\n', "\\n")
      .replace(#char '\r', "\\r")
      .replace(#char '\t', "\\t");
  };

  // Truncate text to at most maxLen characters.
  func truncate(s : Text, maxLen : Nat) : Text {
    if (s.size() <= maxLen) { s } else {
      let chars = s.toArray();
      let sliced = chars.sliceToArray(0, maxLen.toInt());
      Text.fromArray(sliced);
    };
  };

  // Build a JSON array from a Motoko array of Text values.
  func buildJsonArray(items : [Text]) : Text {
    let parts = items.map<Text, Text>(func(item) { "\"" # escapeJson(item) # "\"" });
    "[" # Text.join(parts.values(), ",") # "]";
  };

  // Extract the content field from an OpenAI chat completion JSON response.
  // Returns the raw response if parsing fails.
  func extractOpenAiContent(response : Text) : Text {
    // Look for "content":"..." pattern
    let marker = "\"content\":\"";
    let parts = response.split(#text marker);
    let partsArr = parts.toArray();
    if (partsArr.size() < 2) { return response };
    let after = partsArr[1];
    // find closing quote (not escaped)
    let chars = after.toArray();
    var result = "";
    var i = 0;
    var done = false;
    while (i < chars.size() and not done) {
      let c = chars[i];
      if (c == '\\' and i + 1 < chars.size()) {
        let next = chars[i + 1];
        if (next == '"') {
          result := result # "\"";
          i := i + 2;
        } else if (next == 'n') {
          result := result # "\n";
          i := i + 2;
        } else if (next == 't') {
          result := result # "\t";
          i := i + 2;
        } else if (next == '\\') {
          result := result # "\\";
          i := i + 2;
        } else {
          result := result # Text.fromChar(next);
          i := i + 2;
        };
      } else if (c == '"') {
        done := true;
      } else {
        result := result # Text.fromChar(c);
        i := i + 1;
      };
    };
    if (result.size() > 0) { result } else { response };
  };
};
