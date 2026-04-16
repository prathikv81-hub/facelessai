import { r as reactExports, j as jsxRuntimeExports, c as cn, R as React, u as useAuth, e as useQueryClient, b as ue, L as Link } from "./index-CMKZUFdA.js";
import { L as Layout, S as Settings, a as LoaderCircle, d as SubscriptionStatus, B as Badge, Z as Zap, C as CreditCard } from "./badge-DORezHz4.js";
import { B as Button } from "./button-BfOBeu4g.js";
import { C as Card, b as CardHeader, a as CardContent } from "./card-CI9qC1Hp.js";
import { D as Dialog, a as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription, f as DialogFooter } from "./dialog-BE2wOEGo.js";
import { P as Primitive, L as Label, I as Input, E as ExternalLink, T as Textarea, u as useYouTubeConnection, a as useYouTubeActions } from "./useYouTubeConnection-DxLoZ4r2.js";
import { S as Skeleton } from "./skeleton-BphBmZjD.js";
import { c as createLucideIcon, u as useBackend, a as useQuery } from "./createLucideIcon-CjzoZNB-.js";
import { u as useBrandKit, a as useSaveBrandKit } from "./useBrandKit-k7ZqRIFc.js";
import { u as useMutation } from "./useMutation-tcAt8btY.js";
import { m as motion } from "./proxy-DIUJpt6T.js";
import { C as Check } from "./check-CjBsStuQ.js";
import { C as CircleCheck } from "./circle-check-D6IEpUVO.js";
import { T as TriangleAlert } from "./triangle-alert-Br0KOIU-.js";
import "./index-BI5q8Z8b.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4", key: "g0fldk" }],
  ["path", { d: "m21 2-9.6 9.6", key: "1j0ho8" }],
  ["circle", { cx: "7.5", cy: "15.5", r: "5.5", key: "yqb3hr" }]
];
const Key = createLucideIcon("key", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",
      key: "e79jfc"
    }
  ],
  ["circle", { cx: "13.5", cy: "6.5", r: ".5", fill: "currentColor", key: "1okk4w" }],
  ["circle", { cx: "17.5", cy: "10.5", r: ".5", fill: "currentColor", key: "f64h9f" }],
  ["circle", { cx: "6.5", cy: "12.5", r: ".5", fill: "currentColor", key: "qy21gx" }],
  ["circle", { cx: "8.5", cy: "7.5", r: ".5", fill: "currentColor", key: "fotxhn" }]
];
const Palette = createLucideIcon("palette", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71",
      key: "yqzxt4"
    }
  ],
  [
    "path",
    {
      d: "m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71",
      key: "4qinb0"
    }
  ],
  ["line", { x1: "8", x2: "8", y1: "2", y2: "5", key: "1041cp" }],
  ["line", { x1: "2", x2: "5", y1: "8", y2: "8", key: "14m1p5" }],
  ["line", { x1: "16", x2: "16", y1: "19", y2: "22", key: "rzdirn" }],
  ["line", { x1: "19", x2: "22", y1: "16", y2: "16", key: "ox905f" }]
];
const Unlink = createLucideIcon("unlink", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 20h.01", key: "zekei9" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 20 0", key: "dnpr2z" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 14 0", key: "1x1e6c" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }]
];
const Wifi = createLucideIcon("wifi", __iconNode);
var NAME = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = ["horizontal", "vertical"];
var Separator$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
  const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
  const ariaOrientation = orientation === "vertical" ? orientation : void 0;
  const semanticProps = decorative ? { role: "none" } : { "aria-orientation": ariaOrientation, role: "separator" };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "data-orientation": orientation,
      ...semanticProps,
      ...domProps,
      ref: forwardedRef
    }
  );
});
Separator$1.displayName = NAME;
function isValidOrientation(orientation) {
  return ORIENTATIONS.includes(orientation);
}
var Root = Separator$1;
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
function Table({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "table-container",
      className: "relative w-full overflow-x-auto",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "table",
        {
          "data-slot": "table",
          className: cn("w-full caption-bottom text-sm", className),
          ...props
        }
      )
    }
  );
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "thead",
    {
      "data-slot": "table-header",
      className: cn("[&_tr]:border-b", className),
      ...props
    }
  );
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tr",
    {
      "data-slot": "table-row",
      className: cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      ),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "th",
    {
      "data-slot": "table-head",
      className: cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "td",
    {
      "data-slot": "table-cell",
      className: cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
var DefaultContext = {
  color: void 0,
  size: void 0,
  className: void 0,
  style: void 0,
  attr: void 0
};
var IconContext = React.createContext && /* @__PURE__ */ React.createContext(DefaultContext);
var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o, r, i = _objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /* @__PURE__ */ React.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return (props) => /* @__PURE__ */ React.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = (conf) => {
    var {
      attr,
      size,
      title
    } = props, svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /* @__PURE__ */ React.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /* @__PURE__ */ React.createElement("title", null, title), props.children);
  };
  return IconContext !== void 0 ? /* @__PURE__ */ React.createElement(IconContext.Consumer, null, (conf) => elem(conf)) : elem(DefaultContext);
}
function SiYoutube(props) {
  return GenIcon({ "attr": { "role": "img", "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "d": "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" }, "child": [] }] })(props);
}
function tierLabel(tier) {
  if (!tier) return "Free";
  return { starter: "Starter", pro: "Pro", enterprise: "Enterprise" }[tier] ?? tier;
}
function tierCredits(tier) {
  return { starter: 10, pro: 30, enterprise: 100 }[tier ?? ""] ?? 0;
}
function formatDate(ts) {
  if (!ts) return "—";
  return new Date(Number(ts)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function buildCreditHistory(profile) {
  var _a;
  if (!profile) return [];
  const entries = [];
  if (profile.subscription) {
    entries.push({
      id: 1,
      description: `${tierLabel(profile.subscription.tier)} plan activated`,
      delta: tierCredits(profile.subscription.tier),
      timestamp: profile.subscription.createdAt
    });
  }
  if (profile.creditBalance > 0n) {
    entries.push({
      id: 2,
      description: "Credits used for video generation",
      delta: -Number(
        BigInt(tierCredits((_a = profile.subscription) == null ? void 0 : _a.tier)) - profile.creditBalance
      ),
      timestamp: profile.updatedAt
    });
  }
  return entries.filter((e) => e.delta !== 0);
}
function SectionCard({
  icon,
  title,
  children,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border shadow-card", "data-ocid": ocid, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-semibold flex items-center gap-2 text-base text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: icon }),
      title
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children })
  ] });
}
function AccountSection({ profile }) {
  const { principal } = useAuth();
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [displayName, setDisplayName] = reactExports.useState((profile == null ? void 0 : profile.displayName) ?? "");
  const [email, setEmail] = reactExports.useState((profile == null ? void 0 : profile.email) ?? "");
  const [saved, setSaved] = reactExports.useState(false);
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      await actor.saveCallerProfile(displayName, email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerProfile"] });
      setSaved(true);
      ue.success("Profile saved successfully");
      setTimeout(() => setSaved(false), 2500);
    },
    onError: (err) => {
      ue.error(
        `Failed to save: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SectionCard,
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4" }),
      title: "Account",
      ocid: "settings.account_card",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "Principal ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "code",
            {
              className: "block text-xs bg-muted px-3 py-2 rounded-md font-mono break-all text-foreground",
              "data-ocid": "settings.principal_display",
              children: principal ?? "—"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "display-name",
                className: "text-xs text-muted-foreground font-medium",
                children: "Display Name"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "display-name",
                value: displayName,
                onChange: (e) => setDisplayName(e.target.value),
                placeholder: "Your name",
                className: "h-9",
                "data-ocid": "settings.display_name_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "email",
                className: "text-xs text-muted-foreground font-medium",
                children: "Email"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "email",
                type: "email",
                value: email,
                onChange: (e) => setEmail(e.target.value),
                placeholder: "you@example.com",
                className: "h-9",
                "data-ocid": "settings.email_input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => saveMutation.mutate(),
            disabled: saveMutation.isPending,
            size: "sm",
            className: "gradient-accent text-primary-foreground border-0 hover:opacity-90",
            "data-ocid": "settings.save_profile_button",
            children: [
              saveMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }) : saved ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 mr-2" }) : null,
              saved ? "Saved!" : "Save Profile"
            ]
          }
        ) })
      ] })
    }
  );
}
function SubscriptionSection({
  profile,
  onCancelRequest
}) {
  const sub = profile == null ? void 0 : profile.subscription;
  const hasSub = sub && sub.status === SubscriptionStatus.active;
  const tierName = tierLabel(sub == null ? void 0 : sub.tier);
  const credits = tierCredits(sub == null ? void 0 : sub.tier);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SectionCard,
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-4 h-4" }),
      title: "Subscription",
      ocid: "settings.subscription_card",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: hasSub ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Current plan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              credits,
              " credits/month · renews",
              " ",
              formatDate(sub == null ? void 0 : sub.currentPeriodEnd)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "gradient-accent text-primary-foreground border-0 font-semibold", children: tierName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 rounded-lg bg-secondary/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-primary flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground", children: [
              Number((profile == null ? void 0 : profile.creditBalance) ?? 0n),
              " credits remaining"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full gradient-accent rounded-full transition-smooth",
                style: {
                  width: `${Math.min(
                    100,
                    Number((profile == null ? void 0 : profile.creditBalance) ?? 0n) / credits * 100
                  )}%`
                }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground whitespace-nowrap", children: [
            "of ",
            credits
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Upgrade or change plan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Compare all available plans." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/pricing", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "gap-1.5",
              "data-ocid": "settings.view_plans_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5" }),
                "View Plans"
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Cancel subscription" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Access continues until ",
              formatDate(sub == null ? void 0 : sub.currentPeriodEnd),
              "."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "border-destructive/50 text-destructive hover:bg-destructive/10",
              onClick: onCancelRequest,
              "data-ocid": "settings.cancel_subscription_button",
              children: "Cancel"
            }
          )
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 py-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-5 h-5 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No active subscription" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Subscribe to start generating videos." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/pricing", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            className: "gradient-accent text-primary-foreground border-0 hover:opacity-90",
            "data-ocid": "settings.subscribe_button",
            children: "View Plans"
          }
        ) })
      ] }) })
    }
  );
}
const VOICE_OPTIONS = [
  { value: "alloy", label: "Alloy" },
  { value: "echo", label: "Echo" },
  { value: "fable", label: "Fable" },
  { value: "onyx", label: "Onyx" },
  { value: "nova", label: "Nova" },
  { value: "shimmer", label: "Shimmer" }
];
const VISUAL_STYLE_OPTIONS = [
  { value: "cinematic", label: "Cinematic" },
  { value: "animation", label: "Animation" },
  { value: "photorealistic", label: "Photorealistic" }
];
const ASPECT_RATIO_OPTIONS = [
  { value: "16:9", label: "16:9 — Landscape" },
  { value: "9:16", label: "9:16 — Portrait" },
  { value: "1:1", label: "1:1 — Square" }
];
const DEFAULT_BRAND_KIT = {
  voice: "alloy",
  visualStyle: "cinematic",
  aspectRatio: "16:9",
  introText: "",
  outroText: ""
};
function BrandKitSection() {
  const { data: brandKit, isLoading } = useBrandKit();
  const saveBrandKit = useSaveBrandKit();
  const [form, setForm] = reactExports.useState(DEFAULT_BRAND_KIT);
  const brandKitApplied = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (brandKit && !brandKitApplied.current) {
      brandKitApplied.current = true;
      setForm({
        voice: brandKit.voice || "alloy",
        visualStyle: brandKit.visualStyle || "cinematic",
        aspectRatio: brandKit.aspectRatio || "16:9",
        introText: brandKit.introText || "",
        outroText: brandKit.outroText || ""
      });
    }
  }, [brandKit]);
  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  async function handleSave() {
    try {
      await saveBrandKit.mutateAsync(form);
      ue.success("Brand Kit saved successfully");
    } catch (err) {
      ue.error(
        `Failed to save: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionCard,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { className: "w-4 h-4" }),
        title: "Brand Kit",
        ocid: "settings.brand_kit_card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "settings.brand_kit.loading_state", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full rounded-md" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full rounded-md" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full rounded-md" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-md" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-md" })
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SectionCard,
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { className: "w-4 h-4" }),
      title: "Brand Kit",
      ocid: "settings.brand_kit_card",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Set your default voice, style, and layout. These will auto-populate the Generate form so every video stays on-brand." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "brand-voice",
              className: "text-xs font-medium text-muted-foreground",
              children: "Default Voice"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                id: "brand-voice",
                value: form.voice,
                onChange: (e) => handleChange("voice", e.target.value),
                className: "w-full h-9 pl-3 pr-8 rounded-md border border-input bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none transition-smooth",
                "data-ocid": "settings.brand_kit.voice_select",
                children: VOICE_OPTIONS.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: v.value, children: v.label }, v.value))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "svg",
              {
                className: "absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                strokeWidth: 2,
                "aria-hidden": "true",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M19 9l-7 7-7-7"
                  }
                )
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "brand-style",
              className: "text-xs font-medium text-muted-foreground",
              children: "Default Visual Style"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                id: "brand-style",
                value: form.visualStyle,
                onChange: (e) => handleChange("visualStyle", e.target.value),
                className: "w-full h-9 pl-3 pr-8 rounded-md border border-input bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none transition-smooth",
                "data-ocid": "settings.brand_kit.visual_style_select",
                children: VISUAL_STYLE_OPTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.value, children: s.label }, s.value))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "svg",
              {
                className: "absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                strokeWidth: 2,
                "aria-hidden": "true",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M19 9l-7 7-7-7"
                  }
                )
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "brand-aspect",
              className: "text-xs font-medium text-muted-foreground",
              children: "Default Aspect Ratio"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                id: "brand-aspect",
                value: form.aspectRatio,
                onChange: (e) => handleChange("aspectRatio", e.target.value),
                className: "w-full h-9 pl-3 pr-8 rounded-md border border-input bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none transition-smooth",
                "data-ocid": "settings.brand_kit.aspect_ratio_select",
                children: ASPECT_RATIO_OPTIONS.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: a.value, children: a.label }, a.value))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "svg",
              {
                className: "absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                strokeWidth: 2,
                "aria-hidden": "true",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M19 9l-7 7-7-7"
                  }
                )
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Label,
            {
              htmlFor: "brand-intro",
              className: "text-xs font-medium text-muted-foreground",
              children: [
                "Intro Text",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 font-normal", children: "(optional)" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "brand-intro",
              value: form.introText,
              onChange: (e) => handleChange("introText", e.target.value.slice(0, 300)),
              placeholder: "Welcome to our channel! Today we're exploring…",
              rows: 3,
              className: "resize-none text-sm",
              "data-ocid": "settings.brand_kit.intro_text_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: cn(
                "text-xs text-right",
                form.introText.length > 270 ? "text-destructive" : "text-muted-foreground"
              ),
              children: [
                form.introText.length,
                "/300"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Label,
            {
              htmlFor: "brand-outro",
              className: "text-xs font-medium text-muted-foreground",
              children: [
                "Outro Text",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 font-normal", children: "(optional)" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "brand-outro",
              value: form.outroText,
              onChange: (e) => handleChange("outroText", e.target.value.slice(0, 300)),
              placeholder: "Thanks for watching! Don't forget to like and subscribe…",
              rows: 3,
              className: "resize-none text-sm",
              "data-ocid": "settings.brand_kit.outro_text_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: cn(
                "text-xs text-right",
                form.outroText.length > 270 ? "text-destructive" : "text-muted-foreground"
              ),
              children: [
                form.outroText.length,
                "/300"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: handleSave,
            disabled: saveBrandKit.isPending,
            size: "sm",
            className: "gradient-accent text-primary-foreground border-0 hover:opacity-90",
            "data-ocid": "settings.brand_kit.save_button",
            children: [
              saveBrandKit.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }) : saveBrandKit.isSuccess ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 mr-2" }) : null,
              "Save Brand Kit"
            ]
          }
        ) })
      ] })
    }
  );
}
const YOUTUBE_OAUTH_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";
const YOUTUBE_REDIRECT_URI = typeof window !== "undefined" ? `${window.location.origin}/settings` : "";
function buildYouTubeOAuthUrl() {
  const params = new URLSearchParams({
    client_id: YOUTUBE_OAUTH_CLIENT_ID,
    redirect_uri: YOUTUBE_REDIRECT_URI,
    response_type: "code",
    scope: [
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube.readonly"
    ].join(" "),
    access_type: "offline",
    prompt: "consent"
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
function YouTubeConnectionSection() {
  const { data: ytStatus, isLoading } = useYouTubeConnection();
  const { connectYouTube, disconnectYouTube } = useYouTubeActions();
  const [disconnectOpen, setDisconnectOpen] = reactExports.useState(false);
  const connectYouTubeMutate = connectYouTube.mutate;
  reactExports.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      window.history.replaceState({}, "", window.location.pathname);
      connectYouTubeMutate({
        authCode: code,
        redirectUri: YOUTUBE_REDIRECT_URI
      });
    }
  }, [connectYouTubeMutate]);
  function handleConnect() {
    window.location.href = buildYouTubeOAuthUrl();
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionCard,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(SiYoutube, { className: "w-4 h-4" }),
        title: "YouTube Connection",
        ocid: "settings.youtube_card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "settings.youtube.loading_state", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-lg" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-32 rounded-md" })
        ] })
      }
    );
  }
  const isConnected = (ytStatus == null ? void 0 : ytStatus.connected) ?? false;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionCard,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(SiYoutube, { className: "w-4 h-4" }),
        title: "YouTube Connection",
        ocid: "settings.youtube_card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Connect your YouTube channel to publish generated videos directly from FacelessAI." }),
          isConnected ? (
            /* ── Connected state ── */
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-destructive flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SiYoutube, { className: "w-5 h-5 text-white" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: (ytStatus == null ? void 0 : ytStatus.channelName) ?? "Your Channel" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: (ytStatus == null ? void 0 : ytStatus.channelId) ?? "" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    className: "flex items-center gap-1 bg-success/15 text-success border border-success/30 text-xs flex-shrink-0",
                    "data-ocid": "settings.youtube.connected_badge",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3" }),
                      "Connected"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Disconnect channel" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "You can reconnect at any time." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    className: "border-destructive/50 text-destructive hover:bg-destructive/10 gap-1.5",
                    onClick: () => setDisconnectOpen(true),
                    "data-ocid": "settings.youtube.disconnect_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Unlink, { className: "w-3.5 h-3.5" }),
                      "Disconnect"
                    ]
                  }
                )
              ] })
            ] })
          ) : (
            /* ── Disconnected state ── */
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4 py-4 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SiYoutube, { className: "w-8 h-8 text-destructive" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "No YouTube channel connected" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 max-w-xs", children: "Connect your channel to publish videos directly and track performance from your dashboard." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  onClick: handleConnect,
                  disabled: connectYouTube.isPending,
                  className: "bg-destructive hover:bg-destructive/90 text-white border-0 gap-2 shadow-sm",
                  "data-ocid": "settings.youtube.connect_button",
                  children: [
                    connectYouTube.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(SiYoutube, { className: "w-4 h-4" }),
                    "Connect YouTube Account"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Secure OAuth 2.0 — we never store your password" })
              ] })
            ] })
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: disconnectOpen,
        onOpenChange: (o) => !o && setDisconnectOpen(false),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "settings.youtube.disconnect_dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Unlink, { className: "w-5 h-5 text-destructive" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Disconnect YouTube?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
              "Your YouTube channel ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: ytStatus == null ? void 0 : ytStatus.channelName }),
              " will be unlinked. Videos already published will remain on YouTube. You can reconnect at any time."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setDisconnectOpen(false),
                disabled: disconnectYouTube.isPending,
                "data-ocid": "settings.youtube.disconnect_dialog.cancel_button",
                children: "Keep Connected"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "destructive",
                onClick: () => {
                  disconnectYouTube.mutate(void 0, {
                    onSuccess: () => setDisconnectOpen(false)
                  });
                },
                disabled: disconnectYouTube.isPending,
                "data-ocid": "settings.youtube.disconnect_dialog.confirm_button",
                children: [
                  disconnectYouTube.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
                  "Yes, Disconnect"
                ]
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function CreditHistorySection({
  profile
}) {
  const entries = buildCreditHistory(profile);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SectionCard,
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4" }),
      title: "Credit History",
      ocid: "settings.credit_history_card",
      children: entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-center py-8 text-muted-foreground text-sm",
          "data-ocid": "settings.credit_history.empty_state",
          children: "No credit transactions yet."
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-ocid": "settings.credit_history_table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Credits" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Date" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: entries.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableRow,
          {
            "data-ocid": `settings.credit_history.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-foreground", children: entry.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TableCell,
                {
                  className: cn(
                    "text-right font-mono text-sm font-medium",
                    entry.delta > 0 ? "text-primary" : "text-destructive"
                  ),
                  children: entry.delta > 0 ? `+${entry.delta}` : entry.delta
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-xs text-muted-foreground", children: formatDate(entry.timestamp) })
            ]
          },
          entry.id
        )) })
      ] })
    }
  );
}
function ApiKeysSection({ isAdmin }) {
  const { actor } = useBackend();
  const [openAiKey, setOpenAiKey] = reactExports.useState("");
  const [replicateKey, setReplicateKey] = reactExports.useState("");
  const [saved, setSaved] = reactExports.useState(false);
  const saveKeysMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (openAiKey) await actor.setOpenAiKey(openAiKey);
      if (replicateKey) await actor.setReplicateKey(replicateKey);
    },
    onSuccess: () => {
      setSaved(true);
      ue.success("API keys saved");
      setOpenAiKey("");
      setReplicateKey("");
      setTimeout(() => setSaved(false), 2500);
    },
    onError: (err) => {
      ue.error(
        `Failed: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  });
  if (!isAdmin) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SectionCard,
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "w-4 h-4" }),
      title: "API Configuration (Admin)",
      ocid: "settings.api_keys_card",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Configure AI service keys used by the platform. Changes affect all users." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "openai-key",
              className: "text-xs font-medium text-muted-foreground",
              children: "OpenAI API Key"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "openai-key",
              type: "password",
              value: openAiKey,
              onChange: (e) => setOpenAiKey(e.target.value),
              placeholder: "sk-proj-…",
              className: "h-9 font-mono text-sm",
              "data-ocid": "settings.openai_key_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "replicate-key",
              className: "text-xs font-medium text-muted-foreground",
              children: "Replicate API Key"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "replicate-key",
              type: "password",
              value: replicateKey,
              onChange: (e) => setReplicateKey(e.target.value),
              placeholder: "r8_…",
              className: "h-9 font-mono text-sm",
              "data-ocid": "settings.replicate_key_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => saveKeysMutation.mutate(),
            disabled: saveKeysMutation.isPending || !openAiKey && !replicateKey,
            size: "sm",
            className: "gradient-accent text-primary-foreground border-0 hover:opacity-90",
            "data-ocid": "settings.save_keys_button",
            children: [
              saveKeysMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }) : saved ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 mr-2" }) : null,
              saved ? "Saved!" : "Save API Keys"
            ]
          }
        ) })
      ] })
    }
  );
}
function CancelDialog({
  open,
  onClose,
  onConfirm,
  isPending
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "settings.cancel_dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-destructive" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Cancel subscription?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Your plan will remain active until the end of the current billing period. After that, your credits will not renew and video generation will be disabled." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: onClose,
          disabled: isPending,
          "data-ocid": "settings.cancel_dialog.cancel_button",
          children: "Keep Subscription"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "destructive",
          onClick: onConfirm,
          disabled: isPending,
          "data-ocid": "settings.cancel_dialog.confirm_button",
          children: [
            isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
            "Yes, Cancel"
          ]
        }
      )
    ] })
  ] }) });
}
function SettingsPage() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [cancelOpen, setCancelOpen] = reactExports.useState(false);
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerProfile();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 6e4
  });
  const { data: isAdmin = false } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      await actor.cancelSubscription();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerProfile"] });
      queryClient.invalidateQueries({ queryKey: ["creditBalance"] });
      setCancelOpen(false);
      ue.success(
        "Subscription cancelled. Access continues until period end."
      );
    },
    onError: (err) => {
      ue.error(
        `Cancellation failed: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "p-4 md:p-6 max-w-2xl mx-auto space-y-6 animate-fade-in",
        "data-ocid": "settings.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.4 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-2xl md:text-3xl flex items-center gap-2 text-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-6 h-6 text-primary" }),
                  "Settings"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Manage your account, subscription, brand kit, and API configuration." })
              ]
            }
          ),
          profileLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "settings.loading_state", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full rounded-xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-56 w-full rounded-xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 w-full rounded-xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 w-full rounded-xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-72 w-full rounded-xl" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.4, delay: 0.05 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(AccountSection, { profile: profile ?? null })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.4, delay: 0.1 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SubscriptionSection,
                  {
                    profile: profile ?? null,
                    onCancelRequest: () => setCancelOpen(true)
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.4, delay: 0.15 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrandKitSection, {})
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.4, delay: 0.2 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(YouTubeConnectionSection, {})
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.4, delay: 0.25 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditHistorySection, { profile: profile ?? null })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.4, delay: 0.3 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ApiKeysSection, { isAdmin })
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CancelDialog,
      {
        open: cancelOpen,
        onClose: () => setCancelOpen(false),
        onConfirm: () => cancelMutation.mutate(),
        isPending: cancelMutation.isPending
      }
    )
  ] });
}
export {
  SettingsPage as default
};
