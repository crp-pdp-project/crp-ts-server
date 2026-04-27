export const ErrorConstants = {
  INTERNAL_STACK_PATTERNS: [
    /^\s*at node:/,
    /^\s*at internal\//,
    /^\s*at Module\./,
    /^\s*at Function\._load/,
    /^\s*at TracingChannel\.traceSync/,
    /^\s*at wrapModuleLoad/,
    /^\s*at executeUserEntryPoint/,
    /^\s*at asyncRunEntryPointWithESMLoader/,
    /^\s*at process\.processTicksAndRejections/,
  ],
  STACK_SUMMARY_LINES: 6,
} as const;
