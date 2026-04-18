// Ambient declarations so tsc --noEmit can reason about the window.EBT
// namespace shared across the modular scripts. Add new subfields here as
// you extract more modules.

interface EBTNamespace {
  [key: string]: any;
  Utils?: any;
  Storage?: any;
  Stats?: any;
  MyDict?: any;
  Session?: any;
  I18N?: any;
  Migrations?: any;
  Validation?: any;
  Router?: any;
  Render?: any;
}

interface Window {
  EBT: EBTNamespace;
}

declare var EBT: EBTNamespace;
