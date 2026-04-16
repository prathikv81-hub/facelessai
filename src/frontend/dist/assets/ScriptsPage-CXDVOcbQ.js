import { j as jsxRuntimeExports, a as useNavigate, r as reactExports, b as ue } from "./index-CMKZUFdA.js";
import { L as Layout, B as Badge, g as BookOpen, V as Video } from "./badge-DORezHz4.js";
import { i as useScripts, F as FileText, j as useDeleteScript, A as AlertDialog, a as AlertDialogTrigger, T as Trash2, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./useScripts-CN0Uavwl.js";
import { B as Button } from "./button-BfOBeu4g.js";
import { S as Skeleton } from "./skeleton-BphBmZjD.js";
import "./createLucideIcon-CjzoZNB-.js";
import "./index-BI5q8Z8b.js";
import "./useMutation-tcAt8btY.js";
function formatDate(createdAt) {
  const ms = Number(createdAt / 1000000n);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(ms));
}
function ScriptCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5 flex flex-col gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-48 rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16 rounded-full" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full rounded" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4 rounded" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-28 rounded-md" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 rounded-md" })
      ] })
    ] })
  ] });
}
function EmptyState() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center py-20 px-4 text-center",
      "data-ocid": "scripts.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 shadow-glow-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-10 h-10 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-foreground mb-2", children: "No saved scripts yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-sm mb-6", children: "Your saved scripts will appear here. Save a script from any video to get started." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => navigate({ to: "/generate" }),
            className: "gradient-accent text-primary-foreground shadow-glow-primary hover:opacity-90 transition-smooth",
            "data-ocid": "scripts.empty_generate_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "w-4 h-4 mr-2" }),
              "Generate Your First Video"
            ]
          }
        )
      ]
    }
  );
}
function ScriptCard({ script, index }) {
  const navigate = useNavigate();
  const deleteScript = useDeleteScript();
  const [deleteOpen, setDeleteOpen] = reactExports.useState(false);
  const preview = script.content.length > 150 ? `${script.content.slice(0, 150)}…` : script.content;
  function handleUseInGenerate() {
    navigate({ to: "/generate", search: { scriptId: script.id.toString() } });
  }
  async function handleDelete() {
    try {
      await deleteScript.mutateAsync(script.id);
      ue.success("Script deleted successfully");
      setDeleteOpen(false);
    } catch {
      ue.error("Failed to delete script. Please try again.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "article",
    {
      className: "bg-card border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-primary/40 transition-smooth group",
      "data-ocid": `scripts.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground leading-snug group-hover:text-primary transition-smooth line-clamp-1 flex-1 min-w-0", children: script.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "shrink-0 text-xs font-medium", children: "Script" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed line-clamp-3", children: preview }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-auto pt-1 gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatDate(script.createdAt) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: handleUseInGenerate,
                className: "text-xs h-8 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/60 transition-smooth",
                "data-ocid": `scripts.use_button.${index}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "w-3.5 h-3.5 mr-1.5" }),
                  "Use in Generate"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { open: deleteOpen, onOpenChange: setDeleteOpen, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  className: "h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth",
                  "aria-label": "Delete script",
                  "data-ocid": `scripts.delete_button.${index}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "scripts.delete_dialog", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Script?" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                    "Are you sure you want to delete",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
                      '"',
                      script.title,
                      '"'
                    ] }),
                    "? This action cannot be undone."
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "scripts.delete_cancel_button", children: "Cancel" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    AlertDialogAction,
                    {
                      onClick: handleDelete,
                      disabled: deleteScript.isPending,
                      className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                      "data-ocid": "scripts.delete_confirm_button",
                      children: deleteScript.isPending ? "Deleting…" : "Delete"
                    }
                  )
                ] })
              ] })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function ScriptsPage() {
  const { data: scripts, isLoading, isError } = useScripts();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", "data-ocid": "scripts.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-display text-foreground", children: "Saved Scripts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Reuse your scripts in future video generations." })
      ] }),
      scripts && scripts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "ml-auto text-sm px-3 py-1", children: [
        scripts.length,
        " ",
        scripts.length === 1 ? "script" : "scripts"
      ] })
    ] }),
    isError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-12 text-center",
        "data-ocid": "scripts.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", children: "Failed to load scripts. Please refresh and try again." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => window.location.reload(), children: "Retry" })
        ]
      }
    ),
    isLoading && !isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
        "data-ocid": "scripts.loading_state",
        children: Array.from({ length: 4 }, (_, i) => `skel-${i}`).map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx(ScriptCardSkeleton, {}, key))
      }
    ),
    !isLoading && !isError && (scripts == null ? void 0 : scripts.length) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {}),
    !isLoading && !isError && scripts && scripts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
        "data-ocid": "scripts.list",
        children: scripts.map((script, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ScriptCard,
          {
            script,
            index: i + 1
          },
          script.id.toString()
        ))
      }
    )
  ] }) });
}
export {
  ScriptsPage as default
};
