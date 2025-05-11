/**
 * Action types for DOM modifications
 * @constant
 */
export const ACTION_TYPES = {
  UPDATE_TEXT_CONTENT: 'UPDATE_TEXT_CONTENT',
  ADD_CHILD: 'ADD_CHILD',
  REMOVE_CHILD: 'REMOVE_CHILD',
} as const;

/**
 * Message types for WebSocket communication
 * @constant
 */
export const MESSAGE_TYPES = {
  INIT_DOM: 'INIT_DOM',
  UPDATE_DOM: 'UPDATE_DOM',
} as const;

/**
 * Element keys used in the virtual DOM
 * @constant
 */
export const ELEMENT_KEYS = {
  ROOT_CONTAINER: 'root-container',
  HEADER_CONTAINER: 'header-container',
  CONTENT_CONTAINER: 'content-container',
  TITLE: 'title',
  SUBTITLE: 'subtitle',
} as const;
