import { c as createLucideIcon, u as useBackend, a as useQuery } from "./createLucideIcon-CjzoZNB-.js";
import { j as jsxRuntimeExports, c as cn, r as reactExports, e as useQueryClient, b as ue } from "./index-CMKZUFdA.js";
import { e as createSlot } from "./badge-DORezHz4.js";
import { u as useMutation } from "./useMutation-tcAt8btY.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode);
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
var NAME = "Label";
var Label$1 = reactExports.forwardRef((props, forwardedRef) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.label,
    {
      ...props,
      ref: forwardedRef,
      onMouseDown: (event) => {
        var _a;
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        (_a = props.onMouseDown) == null ? void 0 : _a.call(props, event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    }
  );
});
Label$1.displayName = NAME;
var Root = Label$1;
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
function useYouTubeActions() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const connectYouTube = useMutation({
    mutationFn: async ({ authCode, redirectUri }) => {
      if (!actor) throw new Error("Not connected");
      return actor.connectYouTube(authCode, redirectUri);
    },
    onSuccess: () => {
      ue.success("YouTube channel connected!");
      queryClient.invalidateQueries({ queryKey: ["youtubeConnection"] });
    },
    onError: (err) => {
      ue.error(`Failed to connect YouTube: ${err.message}`);
    }
  });
  const disconnectYouTube = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.disconnectYouTube();
    },
    onSuccess: () => {
      ue.success("YouTube channel disconnected.");
      queryClient.invalidateQueries({ queryKey: ["youtubeConnection"] });
    },
    onError: (err) => {
      ue.error(`Failed to disconnect YouTube: ${err.message}`);
    }
  });
  const publishToYouTube = useMutation({
    mutationFn: async ({ videoId, request }) => {
      if (!actor) throw new Error("Not connected");
      return actor.publishToYouTube(videoId, request);
    },
    onSuccess: (_data, { videoId }) => {
      ue.success("Publishing to YouTube started!");
      queryClient.invalidateQueries({
        queryKey: ["videoJob", videoId.toString()]
      });
      queryClient.invalidateQueries({ queryKey: ["videoJobs"] });
    },
    onError: (err) => {
      ue.error(`Failed to publish to YouTube: ${err.message}`);
    }
  });
  return { connectYouTube, disconnectYouTube, publishToYouTube };
}
function useYouTubeConnection() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["youtubeConnection"],
    queryFn: async () => {
      if (!actor) return { connected: false };
      return actor.getYouTubeConnection();
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e5
  });
}
export {
  ExternalLink as E,
  Input as I,
  Label as L,
  Primitive as P,
  Textarea as T,
  useYouTubeActions as a,
  useYouTubeConnection as u
};
