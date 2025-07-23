// TEMPLATE: Core type definitions for BrainDrive plugins
// TODO: Customize these types based on your plugin's specific needs

import { ApiResponse } from './types/api';

// Service interfaces - these match the BrainDrive service contracts
export interface ApiService {
  get: (url: string, options?: any) => Promise<ApiResponse>;
  post: (url: string, data: any, options?: any) => Promise<ApiResponse>;
  put: (url: string, data: any, options?: any) => Promise<ApiResponse>;
  delete: (url: string, options?: any) => Promise<ApiResponse>;
  postStreaming?: (url: string, data: any, onChunk: (chunk: string) => void, options?: any) => Promise<ApiResponse>;
}

export interface EventService {
  sendMessage: (target: string, message: any, options?: any) => void;
  subscribeToMessages: (target: string, callback: (message: any) => void) => void;
  unsubscribeFromMessages: (target: string, callback: (message: any) => void) => void;
}

export interface ThemeService {
  getCurrentTheme: () => string;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
  addThemeChangeListener: (callback: (theme: string) => void) => void;
  removeThemeChangeListener: (callback: (theme: string) => void) => void;
}

export interface SettingsService {
  get: (key: string) => any;
  set: (key: string, value: any) => Promise<void>;
  getSetting?: (id: string) => Promise<any>;
  setSetting?: (id: string, value: any) => Promise<any>;
  getSettingDefinitions?: () => Promise<any>;
}

export interface PageContextService {
  getCurrentPageContext(): {
    pageId: string;
    pageName: string;
    pageRoute: string;
    isStudioPage: boolean;
  } | null;
  onPageContextChange(callback: (context: any) => void): () => void;
}

// Plugin State Service interface
export interface PluginStateService {
  configure: (config: any) => void;
  getConfiguration: () => any;
  saveState: (state: any) => Promise<void>;
  getState: () => Promise<any>;
  clearState: () => Promise<void>;
  validateState: (state: any) => boolean;
  sanitizeState: (state: any) => any;
  onSave: (callback: (state: any) => void) => () => void;
  onRestore: (callback: (state: any) => void) => () => void;
  onClear: (callback: () => void) => () => void;
}

// Services container
export interface Services {
  api?: ApiService;
  event?: EventService;
  theme?: ThemeService;
  settings?: SettingsService;
  pageContext?: PageContextService;
  pluginState?: PluginStateService;
}


// API Example Plugin-specific types
export interface ApiExampleProps {
  moduleId?: string;
  pluginId?: string;
  instanceId?: string;
  services: Services;
  title?: string;
  description?: string;
  config?: PluginConfig;
}

export interface ApiExampleState {
  isLoading: boolean;
  error: string;
  currentTheme: string;
  isInitializing: boolean;
  isServiceConnected: boolean;
  currentDemo: 'internal' | 'external' | 'overview';
  activeTab: 'learning' | 'service' | 'external';
  status: string;
  data: {
    apiServiceConnected: boolean;
    demoItems: any[];
    externalApiStatus: string;
    requestCount: number;
  } | null;
}

// Legacy interfaces for compatibility
export interface PluginTemplateProps extends ApiExampleProps {}
export interface PluginTemplateState extends ApiExampleState {}

// API Example Plugin configuration interface
export interface PluginConfig {
  refreshInterval?: number;
  showAdvancedOptions?: boolean;
  customSetting?: string;
  autoCheckInterval?: number;
  enableExternalApiCheck?: boolean;
}

// API Example data interface
export interface PluginData {
  id: string;
  name: string;
  value: any;
  timestamp: string;
}

// API Example event interface
export interface PluginEvent {
  type: string;
  data: any;
  timestamp: string;
}