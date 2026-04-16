var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a;
import { P as ProtocolError, T as TimeoutWaitingForResponseErrorCode, q as utf8ToBytes, E as ExternalError, M as MissingRootKeyErrorCode, C as Certificate, t as lookupResultToBuffer, v as RequestStatusResponseStatus, U as UnknownError, w as RequestStatusDoneNoReplyErrorCode, x as RejectError, y as CertifiedRejectErrorCode, A as UNREACHABLE_ERROR, I as InputError, B as InvalidReadStateRequestErrorCode, D as ReadRequestType, F as Principal, G as IDL, H as MissingCanisterIdErrorCode, J as HttpAgent, K as encode, Q as QueryResponseStatus, N as UncertifiedRejectErrorCode, O as isV3ResponseBody, W as isV2ResponseBody, X as UncertifiedRejectUpdateErrorCode, Y as UnexpectedErrorCode, Z as decode, S as Subscribable, _ as pendingThenable, $ as resolveEnabled, s as shallowEqualObjects, a0 as resolveStaleTime, l as noop, a1 as environmentManager, a2 as isValidTimeout, a3 as timeUntilStale, a4 as timeoutManager, a5 as focusManager, a6 as fetchState, a7 as replaceData, n as notifyManager, r as reactExports, m as shouldThrowError, e as useQueryClient, a8 as useInternetIdentity, a9 as createActorWithConfig, aa as Record, ab as Opt, ac as Variant, ad as Vec, ae as Service, af as Func, ag as Nat, ah as Bool, ai as Principal$1, aj as Text, ak as Nat8, al as Null, am as Int } from "./index-CMKZUFdA.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a2;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a2 = agent.createReadStateRequest) == null ? void 0 : _a2.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a2, _b;
      options = {
        ...options,
        ...(_b = (_a2 = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a2, _b;
      options = {
        ...options,
        ...(_b = (_a2 = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout2 = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout2));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function hasAccessControl(actor) {
  return typeof actor === "object" && actor !== null && "_initializeAccessControl" in actor;
}
const ACTOR_QUERY_KEY = "actor";
function useActor(createActor2) {
  const { identity, isAuthenticated } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2);
      }
      const actorOptions = {
        agentOptions: {
          identity
        }
      };
      const actor = await createActorWithConfig(createActor2, actorOptions);
      if (hasAccessControl(actor)) {
        await actor._initializeAccessControl();
      }
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
const _ImmutableObjectStorageCreateCertificateResult = Record({
  "method": Text,
  "blob_hash": Text
});
const _ImmutableObjectStorageRefillInformation = Record({
  "proposed_top_up_amount": Opt(Nat)
});
const _ImmutableObjectStorageRefillResult = Record({
  "success": Opt(Bool),
  "topped_up_amount": Opt(Nat)
});
const CreditsAmount = Nat;
const UserRole = Variant({
  "admin": Null,
  "user": Null,
  "guest": Null
});
const ShoppingItem = Record({
  "productName": Text,
  "currency": Text,
  "quantity": Nat,
  "priceInCents": Nat,
  "productDescription": Text
});
const SubscriptionTier = Variant({
  "pro": Null,
  "enterprise": Null,
  "starter": Null
});
const ScriptId = Nat;
const VideoJobId = Nat;
const BrandKit = Record({
  "outroText": Text,
  "visualStyle": Text,
  "voice": Text,
  "introText": Text,
  "aspectRatio": Text
});
const UserId = Principal$1;
const SubscriptionStatus = Variant({
  "active": Null,
  "cancelled": Null,
  "expired": Null,
  "none": Null
});
const Timestamp = Int;
const Subscription = Record({
  "status": SubscriptionStatus,
  "stripeSubscriptionId": Text,
  "createdAt": Timestamp,
  "tier": SubscriptionTier,
  "currentPeriodEnd": Timestamp,
  "stripeCustomerId": Text
});
const YouTubeConnectionPublic = Record({
  "channelName": Text,
  "channelId": Text,
  "refreshToken": Text,
  "connectedAt": Int,
  "accessToken": Text
});
const UserProfilePublic = Record({
  "id": UserId,
  "displayName": Text,
  "subscription": Opt(Subscription),
  "createdAt": Timestamp,
  "youtubeConnection": Opt(YouTubeConnectionPublic),
  "email": Text,
  "updatedAt": Timestamp,
  "stripeCustomerId": Opt(Text),
  "creditBalance": CreditsAmount,
  "brandKit": Opt(BrandKit)
});
const DashboardAnalytics = Record({
  "avgCompletionRate": Nat,
  "totalViews": Nat,
  "totalVideos": Nat,
  "totalWatchTimeHours": Nat
});
const VideoPublicView = Record({
  "title": Text,
  "thumbnailUrl": Opt(Text),
  "videoJobId": VideoJobId,
  "createdAt": Timestamp,
  "description": Text,
  "viewCount": Nat,
  "videoUrl": Opt(Text)
});
const SavedScript = Record({
  "id": ScriptId,
  "title": Text,
  "content": Text,
  "userId": UserId,
  "createdAt": Timestamp
});
const StripeSessionStatus = Variant({
  "completed": Record({
    "userPrincipal": Opt(Text),
    "response": Text
  }),
  "failed": Record({ "error": Text })
});
const TierConfig = Record({
  "name": Text,
  "tier": SubscriptionTier,
  "description": Text,
  "stripePriceId": Text,
  "creditsPerMonth": CreditsAmount,
  "priceInCents": Nat
});
const VideoAnalytics = Record({
  "completionRatePercent": Nat,
  "videoJobId": VideoJobId,
  "viewCount": Nat,
  "totalWatchTimeSecs": Nat,
  "lastViewedAt": Opt(Timestamp)
});
const VideoJobStatus = Variant({
  "pending": Null,
  "completed": Null,
  "processing": Null,
  "failed": Record({ "reason": Text })
});
const ExternalBlob = Vec(Nat8);
const GenerationMode = Variant({
  "userScript": Record({ "script": Text }),
  "auto": Null
});
const PipelineStage = Variant({
  "voiceover": Null,
  "script": Null,
  "assembly": Null,
  "images": Null
});
const YouTubePublishStatus = Variant({
  "notPublished": Null,
  "published": Null,
  "publishing": Null,
  "failed": Null
});
const VideoJobPublic = Record({
  "id": VideoJobId,
  "status": VideoJobStatus,
  "completionRatePercent": Nat,
  "title": Text,
  "thumbnailUrl": Opt(ExternalBlob),
  "userId": UserId,
  "shareUrl": Opt(Text),
  "script": Opt(Text),
  "mode": GenerationMode,
  "createdAt": Timestamp,
  "errorMessage": Opt(Text),
  "shareToken": Opt(Text),
  "creditsSpent": CreditsAmount,
  "updatedAt": Timestamp,
  "viewCount": Nat,
  "durationSeconds": Opt(Nat),
  "prompt": Text,
  "currentStage": Opt(PipelineStage),
  "totalWatchTimeSecs": Nat,
  "youtubeUrl": Opt(Text),
  "youtubePublishStatus": YouTubePublishStatus,
  "videoUrl": Opt(ExternalBlob),
  "voiceoverUrl": Opt(ExternalBlob),
  "lastViewedAt": Opt(Timestamp)
});
const YouTubeConnectionStatus = Record({
  "channelName": Opt(Text),
  "channelId": Opt(Text),
  "connected": Bool
});
const YouTubeVisibility$1 = Variant({
  "public": Null,
  "private": Null,
  "unlisted": Null
});
const PublishToYouTubeRequest = Record({
  "title": Text,
  "tags": Vec(Text),
  "description": Text,
  "visibility": YouTubeVisibility$1
});
const StripeConfiguration = Record({
  "allowedCountries": Vec(Text),
  "secretKey": Text
});
const CreateVideoRequest = Record({
  "title": Text,
  "mode": GenerationMode,
  "prompt": Text
});
const http_header = Record({
  "value": Text,
  "name": Text
});
const http_request_result = Record({
  "status": Nat,
  "body": Vec(Nat8),
  "headers": Vec(http_header)
});
const TransformationInput = Record({
  "context": Vec(Nat8),
  "response": http_request_result
});
const TransformationOutput = Record({
  "status": Nat,
  "body": Vec(Nat8),
  "headers": Vec(http_header)
});
Service({
  "_immutableObjectStorageBlobsAreLive": Func(
    [Vec(Vec(Nat8))],
    [Vec(Bool)],
    ["query"]
  ),
  "_immutableObjectStorageBlobsToDelete": Func(
    [],
    [Vec(Vec(Nat8))],
    ["query"]
  ),
  "_immutableObjectStorageConfirmBlobDeletion": Func(
    [Vec(Vec(Nat8))],
    [],
    []
  ),
  "_immutableObjectStorageCreateCertificate": Func(
    [Text],
    [_ImmutableObjectStorageCreateCertificateResult],
    []
  ),
  "_immutableObjectStorageRefillCashier": Func(
    [Opt(_ImmutableObjectStorageRefillInformation)],
    [_ImmutableObjectStorageRefillResult],
    []
  ),
  "_immutableObjectStorageUpdateGatewayPrincipals": Func([], [], []),
  "_initializeAccessControl": Func([], [], []),
  "addCredits": Func([Principal$1, CreditsAmount], [], []),
  "assignCallerUserRole": Func([Principal$1, UserRole], [], []),
  "cancelSubscription": Func([], [], []),
  "connectYouTube": Func([Text, Text], [], []),
  "createCheckoutSession": Func(
    [Vec(ShoppingItem), Text, Text],
    [Text],
    []
  ),
  "createSubscriptionCheckout": Func(
    [SubscriptionTier, Text, Text],
    [Text],
    []
  ),
  "deleteScript": Func([ScriptId], [], []),
  "deleteVideoJob": Func([VideoJobId], [], []),
  "disconnectYouTube": Func([], [], []),
  "generateShareLink": Func([VideoJobId], [Text], []),
  "getBrandKit": Func([], [Opt(BrandKit)], ["query"]),
  "getCallerProfile": Func([], [Opt(UserProfilePublic)], ["query"]),
  "getCallerUserRole": Func([], [UserRole], ["query"]),
  "getCreditBalance": Func([], [CreditsAmount], ["query"]),
  "getDashboardAnalytics": Func([], [DashboardAnalytics], []),
  "getPublicVideo": Func(
    [Text],
    [Opt(VideoPublicView)],
    ["query"]
  ),
  "getScript": Func([ScriptId], [Opt(SavedScript)], ["query"]),
  "getStripeSessionStatus": Func([Text], [StripeSessionStatus], []),
  "getSubscriptionTiers": Func([], [Vec(TierConfig)], ["query"]),
  "getUserProfile": Func(
    [Principal$1],
    [Opt(UserProfilePublic)],
    ["query"]
  ),
  "getVideoAnalytics": Func([VideoJobId], [Opt(VideoAnalytics)], []),
  "getVideoJob": Func([VideoJobId], [Opt(VideoJobPublic)], ["query"]),
  "getYouTubeConnection": Func([], [YouTubeConnectionStatus], []),
  "handleStripeWebhook": Func([Text], [], []),
  "isCallerAdmin": Func([], [Bool], ["query"]),
  "isStripeConfigured": Func([], [Bool], ["query"]),
  "listScripts": Func([], [Vec(SavedScript)], ["query"]),
  "listUserVideoJobs": Func([], [Vec(VideoJobPublic)], ["query"]),
  "publishToYouTube": Func([VideoJobId, PublishToYouTubeRequest], [], []),
  "recordVideoEngagement": Func([VideoJobId, Nat, Nat], [], []),
  "saveBrandKit": Func([BrandKit], [], []),
  "saveCallerProfile": Func([Text, Text], [], []),
  "saveScript": Func([Text, Text], [SavedScript], []),
  "setOpenAiKey": Func([Text], [], []),
  "setReplicateKey": Func([Text], [], []),
  "setStripeConfiguration": Func([StripeConfiguration], [], []),
  "setSubscription": Func([Principal$1, Subscription], [], []),
  "submitVideoJob": Func([CreateVideoRequest], [VideoJobId], []),
  "transform": Func(
    [TransformationInput],
    [TransformationOutput],
    ["query"]
  ),
  "updateVideoJobStatus": Func(
    [
      VideoJobId,
      Opt(PipelineStage),
      Opt(Text),
      Bool,
      Bool,
      Opt(Text)
    ],
    [],
    []
  )
});
const idlFactory = ({ IDL: IDL2 }) => {
  const _ImmutableObjectStorageCreateCertificateResult2 = IDL2.Record({
    "method": IDL2.Text,
    "blob_hash": IDL2.Text
  });
  const _ImmutableObjectStorageRefillInformation2 = IDL2.Record({
    "proposed_top_up_amount": IDL2.Opt(IDL2.Nat)
  });
  const _ImmutableObjectStorageRefillResult2 = IDL2.Record({
    "success": IDL2.Opt(IDL2.Bool),
    "topped_up_amount": IDL2.Opt(IDL2.Nat)
  });
  const CreditsAmount2 = IDL2.Nat;
  const UserRole2 = IDL2.Variant({
    "admin": IDL2.Null,
    "user": IDL2.Null,
    "guest": IDL2.Null
  });
  const ShoppingItem2 = IDL2.Record({
    "productName": IDL2.Text,
    "currency": IDL2.Text,
    "quantity": IDL2.Nat,
    "priceInCents": IDL2.Nat,
    "productDescription": IDL2.Text
  });
  const SubscriptionTier2 = IDL2.Variant({
    "pro": IDL2.Null,
    "enterprise": IDL2.Null,
    "starter": IDL2.Null
  });
  const ScriptId2 = IDL2.Nat;
  const VideoJobId2 = IDL2.Nat;
  const BrandKit2 = IDL2.Record({
    "outroText": IDL2.Text,
    "visualStyle": IDL2.Text,
    "voice": IDL2.Text,
    "introText": IDL2.Text,
    "aspectRatio": IDL2.Text
  });
  const UserId2 = IDL2.Principal;
  const SubscriptionStatus2 = IDL2.Variant({
    "active": IDL2.Null,
    "cancelled": IDL2.Null,
    "expired": IDL2.Null,
    "none": IDL2.Null
  });
  const Timestamp2 = IDL2.Int;
  const Subscription2 = IDL2.Record({
    "status": SubscriptionStatus2,
    "stripeSubscriptionId": IDL2.Text,
    "createdAt": Timestamp2,
    "tier": SubscriptionTier2,
    "currentPeriodEnd": Timestamp2,
    "stripeCustomerId": IDL2.Text
  });
  const YouTubeConnectionPublic2 = IDL2.Record({
    "channelName": IDL2.Text,
    "channelId": IDL2.Text,
    "refreshToken": IDL2.Text,
    "connectedAt": IDL2.Int,
    "accessToken": IDL2.Text
  });
  const UserProfilePublic2 = IDL2.Record({
    "id": UserId2,
    "displayName": IDL2.Text,
    "subscription": IDL2.Opt(Subscription2),
    "createdAt": Timestamp2,
    "youtubeConnection": IDL2.Opt(YouTubeConnectionPublic2),
    "email": IDL2.Text,
    "updatedAt": Timestamp2,
    "stripeCustomerId": IDL2.Opt(IDL2.Text),
    "creditBalance": CreditsAmount2,
    "brandKit": IDL2.Opt(BrandKit2)
  });
  const DashboardAnalytics2 = IDL2.Record({
    "avgCompletionRate": IDL2.Nat,
    "totalViews": IDL2.Nat,
    "totalVideos": IDL2.Nat,
    "totalWatchTimeHours": IDL2.Nat
  });
  const VideoPublicView2 = IDL2.Record({
    "title": IDL2.Text,
    "thumbnailUrl": IDL2.Opt(IDL2.Text),
    "videoJobId": VideoJobId2,
    "createdAt": Timestamp2,
    "description": IDL2.Text,
    "viewCount": IDL2.Nat,
    "videoUrl": IDL2.Opt(IDL2.Text)
  });
  const SavedScript2 = IDL2.Record({
    "id": ScriptId2,
    "title": IDL2.Text,
    "content": IDL2.Text,
    "userId": UserId2,
    "createdAt": Timestamp2
  });
  const StripeSessionStatus2 = IDL2.Variant({
    "completed": IDL2.Record({
      "userPrincipal": IDL2.Opt(IDL2.Text),
      "response": IDL2.Text
    }),
    "failed": IDL2.Record({ "error": IDL2.Text })
  });
  const TierConfig2 = IDL2.Record({
    "name": IDL2.Text,
    "tier": SubscriptionTier2,
    "description": IDL2.Text,
    "stripePriceId": IDL2.Text,
    "creditsPerMonth": CreditsAmount2,
    "priceInCents": IDL2.Nat
  });
  const VideoAnalytics2 = IDL2.Record({
    "completionRatePercent": IDL2.Nat,
    "videoJobId": VideoJobId2,
    "viewCount": IDL2.Nat,
    "totalWatchTimeSecs": IDL2.Nat,
    "lastViewedAt": IDL2.Opt(Timestamp2)
  });
  const VideoJobStatus2 = IDL2.Variant({
    "pending": IDL2.Null,
    "completed": IDL2.Null,
    "processing": IDL2.Null,
    "failed": IDL2.Record({ "reason": IDL2.Text })
  });
  const ExternalBlob2 = IDL2.Vec(IDL2.Nat8);
  const GenerationMode2 = IDL2.Variant({
    "userScript": IDL2.Record({ "script": IDL2.Text }),
    "auto": IDL2.Null
  });
  const PipelineStage2 = IDL2.Variant({
    "voiceover": IDL2.Null,
    "script": IDL2.Null,
    "assembly": IDL2.Null,
    "images": IDL2.Null
  });
  const YouTubePublishStatus2 = IDL2.Variant({
    "notPublished": IDL2.Null,
    "published": IDL2.Null,
    "publishing": IDL2.Null,
    "failed": IDL2.Null
  });
  const VideoJobPublic2 = IDL2.Record({
    "id": VideoJobId2,
    "status": VideoJobStatus2,
    "completionRatePercent": IDL2.Nat,
    "title": IDL2.Text,
    "thumbnailUrl": IDL2.Opt(ExternalBlob2),
    "userId": UserId2,
    "shareUrl": IDL2.Opt(IDL2.Text),
    "script": IDL2.Opt(IDL2.Text),
    "mode": GenerationMode2,
    "createdAt": Timestamp2,
    "errorMessage": IDL2.Opt(IDL2.Text),
    "shareToken": IDL2.Opt(IDL2.Text),
    "creditsSpent": CreditsAmount2,
    "updatedAt": Timestamp2,
    "viewCount": IDL2.Nat,
    "durationSeconds": IDL2.Opt(IDL2.Nat),
    "prompt": IDL2.Text,
    "currentStage": IDL2.Opt(PipelineStage2),
    "totalWatchTimeSecs": IDL2.Nat,
    "youtubeUrl": IDL2.Opt(IDL2.Text),
    "youtubePublishStatus": YouTubePublishStatus2,
    "videoUrl": IDL2.Opt(ExternalBlob2),
    "voiceoverUrl": IDL2.Opt(ExternalBlob2),
    "lastViewedAt": IDL2.Opt(Timestamp2)
  });
  const YouTubeConnectionStatus2 = IDL2.Record({
    "channelName": IDL2.Opt(IDL2.Text),
    "channelId": IDL2.Opt(IDL2.Text),
    "connected": IDL2.Bool
  });
  const YouTubeVisibility2 = IDL2.Variant({
    "public": IDL2.Null,
    "private": IDL2.Null,
    "unlisted": IDL2.Null
  });
  const PublishToYouTubeRequest2 = IDL2.Record({
    "title": IDL2.Text,
    "tags": IDL2.Vec(IDL2.Text),
    "description": IDL2.Text,
    "visibility": YouTubeVisibility2
  });
  const StripeConfiguration2 = IDL2.Record({
    "allowedCountries": IDL2.Vec(IDL2.Text),
    "secretKey": IDL2.Text
  });
  const CreateVideoRequest2 = IDL2.Record({
    "title": IDL2.Text,
    "mode": GenerationMode2,
    "prompt": IDL2.Text
  });
  const http_header2 = IDL2.Record({ "value": IDL2.Text, "name": IDL2.Text });
  const http_request_result2 = IDL2.Record({
    "status": IDL2.Nat,
    "body": IDL2.Vec(IDL2.Nat8),
    "headers": IDL2.Vec(http_header2)
  });
  const TransformationInput2 = IDL2.Record({
    "context": IDL2.Vec(IDL2.Nat8),
    "response": http_request_result2
  });
  const TransformationOutput2 = IDL2.Record({
    "status": IDL2.Nat,
    "body": IDL2.Vec(IDL2.Nat8),
    "headers": IDL2.Vec(http_header2)
  });
  return IDL2.Service({
    "_immutableObjectStorageBlobsAreLive": IDL2.Func(
      [IDL2.Vec(IDL2.Vec(IDL2.Nat8))],
      [IDL2.Vec(IDL2.Bool)],
      ["query"]
    ),
    "_immutableObjectStorageBlobsToDelete": IDL2.Func(
      [],
      [IDL2.Vec(IDL2.Vec(IDL2.Nat8))],
      ["query"]
    ),
    "_immutableObjectStorageConfirmBlobDeletion": IDL2.Func(
      [IDL2.Vec(IDL2.Vec(IDL2.Nat8))],
      [],
      []
    ),
    "_immutableObjectStorageCreateCertificate": IDL2.Func(
      [IDL2.Text],
      [_ImmutableObjectStorageCreateCertificateResult2],
      []
    ),
    "_immutableObjectStorageRefillCashier": IDL2.Func(
      [IDL2.Opt(_ImmutableObjectStorageRefillInformation2)],
      [_ImmutableObjectStorageRefillResult2],
      []
    ),
    "_immutableObjectStorageUpdateGatewayPrincipals": IDL2.Func([], [], []),
    "_initializeAccessControl": IDL2.Func([], [], []),
    "addCredits": IDL2.Func([IDL2.Principal, CreditsAmount2], [], []),
    "assignCallerUserRole": IDL2.Func([IDL2.Principal, UserRole2], [], []),
    "cancelSubscription": IDL2.Func([], [], []),
    "connectYouTube": IDL2.Func([IDL2.Text, IDL2.Text], [], []),
    "createCheckoutSession": IDL2.Func(
      [IDL2.Vec(ShoppingItem2), IDL2.Text, IDL2.Text],
      [IDL2.Text],
      []
    ),
    "createSubscriptionCheckout": IDL2.Func(
      [SubscriptionTier2, IDL2.Text, IDL2.Text],
      [IDL2.Text],
      []
    ),
    "deleteScript": IDL2.Func([ScriptId2], [], []),
    "deleteVideoJob": IDL2.Func([VideoJobId2], [], []),
    "disconnectYouTube": IDL2.Func([], [], []),
    "generateShareLink": IDL2.Func([VideoJobId2], [IDL2.Text], []),
    "getBrandKit": IDL2.Func([], [IDL2.Opt(BrandKit2)], ["query"]),
    "getCallerProfile": IDL2.Func([], [IDL2.Opt(UserProfilePublic2)], ["query"]),
    "getCallerUserRole": IDL2.Func([], [UserRole2], ["query"]),
    "getCreditBalance": IDL2.Func([], [CreditsAmount2], ["query"]),
    "getDashboardAnalytics": IDL2.Func([], [DashboardAnalytics2], []),
    "getPublicVideo": IDL2.Func(
      [IDL2.Text],
      [IDL2.Opt(VideoPublicView2)],
      ["query"]
    ),
    "getScript": IDL2.Func([ScriptId2], [IDL2.Opt(SavedScript2)], ["query"]),
    "getStripeSessionStatus": IDL2.Func([IDL2.Text], [StripeSessionStatus2], []),
    "getSubscriptionTiers": IDL2.Func([], [IDL2.Vec(TierConfig2)], ["query"]),
    "getUserProfile": IDL2.Func(
      [IDL2.Principal],
      [IDL2.Opt(UserProfilePublic2)],
      ["query"]
    ),
    "getVideoAnalytics": IDL2.Func([VideoJobId2], [IDL2.Opt(VideoAnalytics2)], []),
    "getVideoJob": IDL2.Func(
      [VideoJobId2],
      [IDL2.Opt(VideoJobPublic2)],
      ["query"]
    ),
    "getYouTubeConnection": IDL2.Func([], [YouTubeConnectionStatus2], []),
    "handleStripeWebhook": IDL2.Func([IDL2.Text], [], []),
    "isCallerAdmin": IDL2.Func([], [IDL2.Bool], ["query"]),
    "isStripeConfigured": IDL2.Func([], [IDL2.Bool], ["query"]),
    "listScripts": IDL2.Func([], [IDL2.Vec(SavedScript2)], ["query"]),
    "listUserVideoJobs": IDL2.Func([], [IDL2.Vec(VideoJobPublic2)], ["query"]),
    "publishToYouTube": IDL2.Func(
      [VideoJobId2, PublishToYouTubeRequest2],
      [],
      []
    ),
    "recordVideoEngagement": IDL2.Func([VideoJobId2, IDL2.Nat, IDL2.Nat], [], []),
    "saveBrandKit": IDL2.Func([BrandKit2], [], []),
    "saveCallerProfile": IDL2.Func([IDL2.Text, IDL2.Text], [], []),
    "saveScript": IDL2.Func([IDL2.Text, IDL2.Text], [SavedScript2], []),
    "setOpenAiKey": IDL2.Func([IDL2.Text], [], []),
    "setReplicateKey": IDL2.Func([IDL2.Text], [], []),
    "setStripeConfiguration": IDL2.Func([StripeConfiguration2], [], []),
    "setSubscription": IDL2.Func([IDL2.Principal, Subscription2], [], []),
    "submitVideoJob": IDL2.Func([CreateVideoRequest2], [VideoJobId2], []),
    "transform": IDL2.Func(
      [TransformationInput2],
      [TransformationOutput2],
      ["query"]
    ),
    "updateVideoJobStatus": IDL2.Func(
      [
        VideoJobId2,
        IDL2.Opt(PipelineStage2),
        IDL2.Opt(IDL2.Text),
        IDL2.Bool,
        IDL2.Bool,
        IDL2.Opt(IDL2.Text)
      ],
      [],
      []
    )
  });
};
function candid_some(value) {
  return [
    value
  ];
}
function candid_none() {
  return [];
}
function record_opt_to_undefined(arg) {
  return arg == null ? void 0 : arg;
}
var YouTubeVisibility = /* @__PURE__ */ ((YouTubeVisibility2) => {
  YouTubeVisibility2["public_"] = "public";
  YouTubeVisibility2["private_"] = "private";
  YouTubeVisibility2["unlisted"] = "unlisted";
  return YouTubeVisibility2;
})(YouTubeVisibility || {});
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async _immutableObjectStorageBlobsAreLive(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageBlobsAreLive(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageBlobsAreLive(arg0);
      return result;
    }
  }
  async _immutableObjectStorageBlobsToDelete() {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageBlobsToDelete();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageBlobsToDelete();
      return result;
    }
  }
  async _immutableObjectStorageConfirmBlobDeletion(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageConfirmBlobDeletion(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageConfirmBlobDeletion(arg0);
      return result;
    }
  }
  async _immutableObjectStorageCreateCertificate(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageCreateCertificate(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageCreateCertificate(arg0);
      return result;
    }
  }
  async _immutableObjectStorageRefillCashier(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageRefillCashier(to_candid_opt_n1(this._uploadFile, this._downloadFile, arg0));
        return from_candid__ImmutableObjectStorageRefillResult_n4(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageRefillCashier(to_candid_opt_n1(this._uploadFile, this._downloadFile, arg0));
      return from_candid__ImmutableObjectStorageRefillResult_n4(this._uploadFile, this._downloadFile, result);
    }
  }
  async _immutableObjectStorageUpdateGatewayPrincipals() {
    if (this.processError) {
      try {
        const result = await this.actor._immutableObjectStorageUpdateGatewayPrincipals();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._immutableObjectStorageUpdateGatewayPrincipals();
      return result;
    }
  }
  async _initializeAccessControl() {
    if (this.processError) {
      try {
        const result = await this.actor._initializeAccessControl();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._initializeAccessControl();
      return result;
    }
  }
  async addCredits(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.addCredits(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addCredits(arg0, arg1);
      return result;
    }
  }
  async assignCallerUserRole(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n8(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n8(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async cancelSubscription() {
    if (this.processError) {
      try {
        const result = await this.actor.cancelSubscription();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.cancelSubscription();
      return result;
    }
  }
  async connectYouTube(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.connectYouTube(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.connectYouTube(arg0, arg1);
      return result;
    }
  }
  async createCheckoutSession(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.createCheckoutSession(arg0, arg1, arg2);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createCheckoutSession(arg0, arg1, arg2);
      return result;
    }
  }
  async createSubscriptionCheckout(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.createSubscriptionCheckout(to_candid_SubscriptionTier_n10(this._uploadFile, this._downloadFile, arg0), arg1, arg2);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createSubscriptionCheckout(to_candid_SubscriptionTier_n10(this._uploadFile, this._downloadFile, arg0), arg1, arg2);
      return result;
    }
  }
  async deleteScript(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteScript(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteScript(arg0);
      return result;
    }
  }
  async deleteVideoJob(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteVideoJob(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteVideoJob(arg0);
      return result;
    }
  }
  async disconnectYouTube() {
    if (this.processError) {
      try {
        const result = await this.actor.disconnectYouTube();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.disconnectYouTube();
      return result;
    }
  }
  async generateShareLink(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.generateShareLink(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.generateShareLink(arg0);
      return result;
    }
  }
  async getBrandKit() {
    if (this.processError) {
      try {
        const result = await this.actor.getBrandKit();
        return from_candid_opt_n12(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getBrandKit();
      return from_candid_opt_n12(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCallerProfile() {
    if (this.processError) {
      try {
        const result = await this.actor.getCallerProfile();
        return from_candid_opt_n13(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCallerProfile();
      return from_candid_opt_n13(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCallerUserRole() {
    if (this.processError) {
      try {
        const result = await this.actor.getCallerUserRole();
        return from_candid_UserRole_n25(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCallerUserRole();
      return from_candid_UserRole_n25(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCreditBalance() {
    if (this.processError) {
      try {
        const result = await this.actor.getCreditBalance();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCreditBalance();
      return result;
    }
  }
  async getDashboardAnalytics() {
    if (this.processError) {
      try {
        const result = await this.actor.getDashboardAnalytics();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getDashboardAnalytics();
      return result;
    }
  }
  async getPublicVideo(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getPublicVideo(arg0);
        return from_candid_opt_n27(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getPublicVideo(arg0);
      return from_candid_opt_n27(this._uploadFile, this._downloadFile, result);
    }
  }
  async getScript(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getScript(arg0);
        return from_candid_opt_n30(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getScript(arg0);
      return from_candid_opt_n30(this._uploadFile, this._downloadFile, result);
    }
  }
  async getStripeSessionStatus(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getStripeSessionStatus(arg0);
        return from_candid_StripeSessionStatus_n31(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getStripeSessionStatus(arg0);
      return from_candid_StripeSessionStatus_n31(this._uploadFile, this._downloadFile, result);
    }
  }
  async getSubscriptionTiers() {
    if (this.processError) {
      try {
        const result = await this.actor.getSubscriptionTiers();
        return from_candid_vec_n34(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getSubscriptionTiers();
      return from_candid_vec_n34(this._uploadFile, this._downloadFile, result);
    }
  }
  async getUserProfile(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getUserProfile(arg0);
        return from_candid_opt_n13(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getUserProfile(arg0);
      return from_candid_opt_n13(this._uploadFile, this._downloadFile, result);
    }
  }
  async getVideoAnalytics(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getVideoAnalytics(arg0);
        return from_candid_opt_n37(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getVideoAnalytics(arg0);
      return from_candid_opt_n37(this._uploadFile, this._downloadFile, result);
    }
  }
  async getVideoJob(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getVideoJob(arg0);
        return from_candid_opt_n41(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getVideoJob(arg0);
      return from_candid_opt_n41(this._uploadFile, this._downloadFile, result);
    }
  }
  async getYouTubeConnection() {
    if (this.processError) {
      try {
        const result = await this.actor.getYouTubeConnection();
        return from_candid_YouTubeConnectionStatus_n55(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getYouTubeConnection();
      return from_candid_YouTubeConnectionStatus_n55(this._uploadFile, this._downloadFile, result);
    }
  }
  async handleStripeWebhook(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.handleStripeWebhook(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.handleStripeWebhook(arg0);
      return result;
    }
  }
  async isCallerAdmin() {
    if (this.processError) {
      try {
        const result = await this.actor.isCallerAdmin();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.isCallerAdmin();
      return result;
    }
  }
  async isStripeConfigured() {
    if (this.processError) {
      try {
        const result = await this.actor.isStripeConfigured();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.isStripeConfigured();
      return result;
    }
  }
  async listScripts() {
    if (this.processError) {
      try {
        const result = await this.actor.listScripts();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listScripts();
      return result;
    }
  }
  async listUserVideoJobs() {
    if (this.processError) {
      try {
        const result = await this.actor.listUserVideoJobs();
        return from_candid_vec_n57(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listUserVideoJobs();
      return from_candid_vec_n57(this._uploadFile, this._downloadFile, result);
    }
  }
  async publishToYouTube(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.publishToYouTube(arg0, to_candid_PublishToYouTubeRequest_n58(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.publishToYouTube(arg0, to_candid_PublishToYouTubeRequest_n58(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async recordVideoEngagement(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.recordVideoEngagement(arg0, arg1, arg2);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.recordVideoEngagement(arg0, arg1, arg2);
      return result;
    }
  }
  async saveBrandKit(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.saveBrandKit(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.saveBrandKit(arg0);
      return result;
    }
  }
  async saveCallerProfile(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.saveCallerProfile(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.saveCallerProfile(arg0, arg1);
      return result;
    }
  }
  async saveScript(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.saveScript(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.saveScript(arg0, arg1);
      return result;
    }
  }
  async setOpenAiKey(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.setOpenAiKey(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.setOpenAiKey(arg0);
      return result;
    }
  }
  async setReplicateKey(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.setReplicateKey(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.setReplicateKey(arg0);
      return result;
    }
  }
  async setStripeConfiguration(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.setStripeConfiguration(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.setStripeConfiguration(arg0);
      return result;
    }
  }
  async setSubscription(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.setSubscription(arg0, to_candid_Subscription_n62(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.setSubscription(arg0, to_candid_Subscription_n62(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async submitVideoJob(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.submitVideoJob(to_candid_CreateVideoRequest_n66(this._uploadFile, this._downloadFile, arg0));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.submitVideoJob(to_candid_CreateVideoRequest_n66(this._uploadFile, this._downloadFile, arg0));
      return result;
    }
  }
  async transform(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.transform(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.transform(arg0);
      return result;
    }
  }
  async updateVideoJobStatus(arg0, arg1, arg2, arg3, arg4, arg5) {
    if (this.processError) {
      try {
        const result = await this.actor.updateVideoJobStatus(arg0, to_candid_opt_n70(this._uploadFile, this._downloadFile, arg1), to_candid_opt_n73(this._uploadFile, this._downloadFile, arg2), arg3, arg4, to_candid_opt_n73(this._uploadFile, this._downloadFile, arg5));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateVideoJobStatus(arg0, to_candid_opt_n70(this._uploadFile, this._downloadFile, arg1), to_candid_opt_n73(this._uploadFile, this._downloadFile, arg2), arg3, arg4, to_candid_opt_n73(this._uploadFile, this._downloadFile, arg5));
      return result;
    }
  }
}
async function from_candid_ExternalBlob_n47(_uploadFile, _downloadFile, value) {
  return await _downloadFile(value);
}
function from_candid_GenerationMode_n48(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n49(_uploadFile, _downloadFile, value);
}
function from_candid_PipelineStage_n51(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n52(_uploadFile, _downloadFile, value);
}
function from_candid_StripeSessionStatus_n31(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n32(_uploadFile, _downloadFile, value);
}
function from_candid_SubscriptionStatus_n19(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n20(_uploadFile, _downloadFile, value);
}
function from_candid_SubscriptionTier_n21(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n22(_uploadFile, _downloadFile, value);
}
function from_candid_Subscription_n17(_uploadFile, _downloadFile, value) {
  return from_candid_record_n18(_uploadFile, _downloadFile, value);
}
function from_candid_TierConfig_n35(_uploadFile, _downloadFile, value) {
  return from_candid_record_n36(_uploadFile, _downloadFile, value);
}
function from_candid_UserProfilePublic_n14(_uploadFile, _downloadFile, value) {
  return from_candid_record_n15(_uploadFile, _downloadFile, value);
}
function from_candid_UserRole_n25(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n26(_uploadFile, _downloadFile, value);
}
function from_candid_VideoAnalytics_n38(_uploadFile, _downloadFile, value) {
  return from_candid_record_n39(_uploadFile, _downloadFile, value);
}
async function from_candid_VideoJobPublic_n42(_uploadFile, _downloadFile, value) {
  return await from_candid_record_n43(_uploadFile, _downloadFile, value);
}
function from_candid_VideoJobStatus_n44(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n45(_uploadFile, _downloadFile, value);
}
function from_candid_VideoPublicView_n28(_uploadFile, _downloadFile, value) {
  return from_candid_record_n29(_uploadFile, _downloadFile, value);
}
function from_candid_YouTubeConnectionStatus_n55(_uploadFile, _downloadFile, value) {
  return from_candid_record_n56(_uploadFile, _downloadFile, value);
}
function from_candid_YouTubePublishStatus_n53(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n54(_uploadFile, _downloadFile, value);
}
function from_candid__ImmutableObjectStorageRefillResult_n4(_uploadFile, _downloadFile, value) {
  return from_candid_record_n5(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n12(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n13(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_UserProfilePublic_n14(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n16(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_Subscription_n17(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n23(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n24(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n27(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_VideoPublicView_n28(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n30(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n37(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_VideoAnalytics_n38(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n40(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
async function from_candid_opt_n41(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : await from_candid_VideoJobPublic_n42(_uploadFile, _downloadFile, value[0]);
}
async function from_candid_opt_n46(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : await from_candid_ExternalBlob_n47(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n50(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_PipelineStage_n51(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n6(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n7(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_record_n15(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    displayName: value.displayName,
    subscription: record_opt_to_undefined(from_candid_opt_n16(_uploadFile, _downloadFile, value.subscription)),
    createdAt: value.createdAt,
    youtubeConnection: record_opt_to_undefined(from_candid_opt_n23(_uploadFile, _downloadFile, value.youtubeConnection)),
    email: value.email,
    updatedAt: value.updatedAt,
    stripeCustomerId: record_opt_to_undefined(from_candid_opt_n24(_uploadFile, _downloadFile, value.stripeCustomerId)),
    creditBalance: value.creditBalance,
    brandKit: record_opt_to_undefined(from_candid_opt_n12(_uploadFile, _downloadFile, value.brandKit))
  };
}
function from_candid_record_n18(_uploadFile, _downloadFile, value) {
  return {
    status: from_candid_SubscriptionStatus_n19(_uploadFile, _downloadFile, value.status),
    stripeSubscriptionId: value.stripeSubscriptionId,
    createdAt: value.createdAt,
    tier: from_candid_SubscriptionTier_n21(_uploadFile, _downloadFile, value.tier),
    currentPeriodEnd: value.currentPeriodEnd,
    stripeCustomerId: value.stripeCustomerId
  };
}
function from_candid_record_n29(_uploadFile, _downloadFile, value) {
  return {
    title: value.title,
    thumbnailUrl: record_opt_to_undefined(from_candid_opt_n24(_uploadFile, _downloadFile, value.thumbnailUrl)),
    videoJobId: value.videoJobId,
    createdAt: value.createdAt,
    description: value.description,
    viewCount: value.viewCount,
    videoUrl: record_opt_to_undefined(from_candid_opt_n24(_uploadFile, _downloadFile, value.videoUrl))
  };
}
function from_candid_record_n33(_uploadFile, _downloadFile, value) {
  return {
    userPrincipal: record_opt_to_undefined(from_candid_opt_n24(_uploadFile, _downloadFile, value.userPrincipal)),
    response: value.response
  };
}
function from_candid_record_n36(_uploadFile, _downloadFile, value) {
  return {
    name: value.name,
    tier: from_candid_SubscriptionTier_n21(_uploadFile, _downloadFile, value.tier),
    description: value.description,
    stripePriceId: value.stripePriceId,
    creditsPerMonth: value.creditsPerMonth,
    priceInCents: value.priceInCents
  };
}
function from_candid_record_n39(_uploadFile, _downloadFile, value) {
  return {
    completionRatePercent: value.completionRatePercent,
    videoJobId: value.videoJobId,
    viewCount: value.viewCount,
    totalWatchTimeSecs: value.totalWatchTimeSecs,
    lastViewedAt: record_opt_to_undefined(from_candid_opt_n40(_uploadFile, _downloadFile, value.lastViewedAt))
  };
}
async function from_candid_record_n43(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    status: from_candid_VideoJobStatus_n44(_uploadFile, _downloadFile, value.status),
    completionRatePercent: value.completionRatePercent,
    title: value.title,
    thumbnailUrl: record_opt_to_undefined(await from_candid_opt_n46(_uploadFile, _downloadFile, value.thumbnailUrl)),
    userId: value.userId,
    shareUrl: record_opt_to_undefined(from_candid_opt_n24(_uploadFile, _downloadFile, value.shareUrl)),
    script: record_opt_to_undefined(from_candid_opt_n24(_uploadFile, _downloadFile, value.script)),
    mode: from_candid_GenerationMode_n48(_uploadFile, _downloadFile, value.mode),
    createdAt: value.createdAt,
    errorMessage: record_opt_to_undefined(from_candid_opt_n24(_uploadFile, _downloadFile, value.errorMessage)),
    shareToken: record_opt_to_undefined(from_candid_opt_n24(_uploadFile, _downloadFile, value.shareToken)),
    creditsSpent: value.creditsSpent,
    updatedAt: value.updatedAt,
    viewCount: value.viewCount,
    durationSeconds: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.durationSeconds)),
    prompt: value.prompt,
    currentStage: record_opt_to_undefined(from_candid_opt_n50(_uploadFile, _downloadFile, value.currentStage)),
    totalWatchTimeSecs: value.totalWatchTimeSecs,
    youtubeUrl: record_opt_to_undefined(from_candid_opt_n24(_uploadFile, _downloadFile, value.youtubeUrl)),
    youtubePublishStatus: from_candid_YouTubePublishStatus_n53(_uploadFile, _downloadFile, value.youtubePublishStatus),
    videoUrl: record_opt_to_undefined(await from_candid_opt_n46(_uploadFile, _downloadFile, value.videoUrl)),
    voiceoverUrl: record_opt_to_undefined(await from_candid_opt_n46(_uploadFile, _downloadFile, value.voiceoverUrl)),
    lastViewedAt: record_opt_to_undefined(from_candid_opt_n40(_uploadFile, _downloadFile, value.lastViewedAt))
  };
}
function from_candid_record_n5(_uploadFile, _downloadFile, value) {
  return {
    success: record_opt_to_undefined(from_candid_opt_n6(_uploadFile, _downloadFile, value.success)),
    topped_up_amount: record_opt_to_undefined(from_candid_opt_n7(_uploadFile, _downloadFile, value.topped_up_amount))
  };
}
function from_candid_record_n56(_uploadFile, _downloadFile, value) {
  return {
    channelName: record_opt_to_undefined(from_candid_opt_n24(_uploadFile, _downloadFile, value.channelName)),
    channelId: record_opt_to_undefined(from_candid_opt_n24(_uploadFile, _downloadFile, value.channelId)),
    connected: value.connected
  };
}
function from_candid_variant_n20(_uploadFile, _downloadFile, value) {
  return "active" in value ? "active" : "cancelled" in value ? "cancelled" : "expired" in value ? "expired" : "none" in value ? "none" : value;
}
function from_candid_variant_n22(_uploadFile, _downloadFile, value) {
  return "pro" in value ? "pro" : "enterprise" in value ? "enterprise" : "starter" in value ? "starter" : value;
}
function from_candid_variant_n26(_uploadFile, _downloadFile, value) {
  return "admin" in value ? "admin" : "user" in value ? "user" : "guest" in value ? "guest" : value;
}
function from_candid_variant_n32(_uploadFile, _downloadFile, value) {
  return "completed" in value ? {
    __kind__: "completed",
    completed: from_candid_record_n33(_uploadFile, _downloadFile, value.completed)
  } : "failed" in value ? {
    __kind__: "failed",
    failed: value.failed
  } : value;
}
function from_candid_variant_n45(_uploadFile, _downloadFile, value) {
  return "pending" in value ? {
    __kind__: "pending",
    pending: value.pending
  } : "completed" in value ? {
    __kind__: "completed",
    completed: value.completed
  } : "processing" in value ? {
    __kind__: "processing",
    processing: value.processing
  } : "failed" in value ? {
    __kind__: "failed",
    failed: value.failed
  } : value;
}
function from_candid_variant_n49(_uploadFile, _downloadFile, value) {
  return "userScript" in value ? {
    __kind__: "userScript",
    userScript: value.userScript
  } : "auto" in value ? {
    __kind__: "auto",
    auto: value.auto
  } : value;
}
function from_candid_variant_n52(_uploadFile, _downloadFile, value) {
  return "voiceover" in value ? "voiceover" : "script" in value ? "script" : "assembly" in value ? "assembly" : "images" in value ? "images" : value;
}
function from_candid_variant_n54(_uploadFile, _downloadFile, value) {
  return "notPublished" in value ? "notPublished" : "published" in value ? "published" : "publishing" in value ? "publishing" : "failed" in value ? "failed" : value;
}
function from_candid_vec_n34(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_TierConfig_n35(_uploadFile, _downloadFile, x));
}
async function from_candid_vec_n57(_uploadFile, _downloadFile, value) {
  return await Promise.all(value.map(async (x) => await from_candid_VideoJobPublic_n42(_uploadFile, _downloadFile, x)));
}
function to_candid_CreateVideoRequest_n66(_uploadFile, _downloadFile, value) {
  return to_candid_record_n67(_uploadFile, _downloadFile, value);
}
function to_candid_GenerationMode_n68(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n69(_uploadFile, _downloadFile, value);
}
function to_candid_PipelineStage_n71(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n72(_uploadFile, _downloadFile, value);
}
function to_candid_PublishToYouTubeRequest_n58(_uploadFile, _downloadFile, value) {
  return to_candid_record_n59(_uploadFile, _downloadFile, value);
}
function to_candid_SubscriptionStatus_n64(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n65(_uploadFile, _downloadFile, value);
}
function to_candid_SubscriptionTier_n10(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n11(_uploadFile, _downloadFile, value);
}
function to_candid_Subscription_n62(_uploadFile, _downloadFile, value) {
  return to_candid_record_n63(_uploadFile, _downloadFile, value);
}
function to_candid_UserRole_n8(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n9(_uploadFile, _downloadFile, value);
}
function to_candid_YouTubeVisibility_n60(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n61(_uploadFile, _downloadFile, value);
}
function to_candid__ImmutableObjectStorageRefillInformation_n2(_uploadFile, _downloadFile, value) {
  return to_candid_record_n3(_uploadFile, _downloadFile, value);
}
function to_candid_opt_n1(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(to_candid__ImmutableObjectStorageRefillInformation_n2(_uploadFile, _downloadFile, value));
}
function to_candid_opt_n70(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(to_candid_PipelineStage_n71(_uploadFile, _downloadFile, value));
}
function to_candid_opt_n73(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(value);
}
function to_candid_record_n3(_uploadFile, _downloadFile, value) {
  return {
    proposed_top_up_amount: value.proposed_top_up_amount ? candid_some(value.proposed_top_up_amount) : candid_none()
  };
}
function to_candid_record_n59(_uploadFile, _downloadFile, value) {
  return {
    title: value.title,
    tags: value.tags,
    description: value.description,
    visibility: to_candid_YouTubeVisibility_n60(_uploadFile, _downloadFile, value.visibility)
  };
}
function to_candid_record_n63(_uploadFile, _downloadFile, value) {
  return {
    status: to_candid_SubscriptionStatus_n64(_uploadFile, _downloadFile, value.status),
    stripeSubscriptionId: value.stripeSubscriptionId,
    createdAt: value.createdAt,
    tier: to_candid_SubscriptionTier_n10(_uploadFile, _downloadFile, value.tier),
    currentPeriodEnd: value.currentPeriodEnd,
    stripeCustomerId: value.stripeCustomerId
  };
}
function to_candid_record_n67(_uploadFile, _downloadFile, value) {
  return {
    title: value.title,
    mode: to_candid_GenerationMode_n68(_uploadFile, _downloadFile, value.mode),
    prompt: value.prompt
  };
}
function to_candid_variant_n11(_uploadFile, _downloadFile, value) {
  return value == "pro" ? {
    pro: null
  } : value == "enterprise" ? {
    enterprise: null
  } : value == "starter" ? {
    starter: null
  } : value;
}
function to_candid_variant_n61(_uploadFile, _downloadFile, value) {
  return value == YouTubeVisibility.public ? {
    public_: null
  } : value == YouTubeVisibility.private ? {
    private_: null
  } : value == "unlisted" ? {
    unlisted: null
  } : value;
}
function to_candid_variant_n65(_uploadFile, _downloadFile, value) {
  return value == "active" ? {
    active: null
  } : value == "cancelled" ? {
    cancelled: null
  } : value == "expired" ? {
    expired: null
  } : value == "none" ? {
    none: null
  } : value;
}
function to_candid_variant_n69(_uploadFile, _downloadFile, value) {
  return value.__kind__ === "userScript" ? {
    userScript: value.userScript
  } : value.__kind__ === "auto" ? {
    auto: value.auto
  } : value;
}
function to_candid_variant_n72(_uploadFile, _downloadFile, value) {
  return value == "voiceover" ? {
    voiceover: null
  } : value == "script" ? {
    script: null
  } : value == "assembly" ? {
    assembly: null
  } : value == "images" ? {
    images: null
  } : value;
}
function to_candid_variant_n9(_uploadFile, _downloadFile, value) {
  return value == "admin" ? {
    admin: null
  } : value == "user" ? {
    user: null
  } : value == "guest" ? {
    guest: null
  } : value;
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
function useBackend() {
  return useActor(createActor);
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => reactExports.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
export {
  useQuery as a,
  createLucideIcon as c,
  useBackend as u
};
