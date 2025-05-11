import React, { useEffect, useState } from 'react';

// Utils
import { ACTION_TYPES, MESSAGE_TYPES, ELEMENT_KEYS } from './utils/constants';
import { wsEndpoint } from './utils/endpoints';

// Styles
import './App.css';

/**
 * Represents a node in our virtual DOM structure.
 * This matches the structure sent from the WebSocket server.
 * 
 * @interface VirtualDOMNode
 * @property {string} type - HTML element type (e.g., 'div', 'p', 'h1')
 * @property {Object} props - Element properties
 * @property {string} [props.className] - CSS class name for styling
 * @property {string} [props.key] - Unique identifier for React reconciliation
 * @property {string} [props.textContent] - Text content of the element
 * @property {VirtualDOMNode[]} children - Child elements
 */
interface VirtualDOMNode {
  type: string;
  props: {
    className?: string;
    key?: string;
    textContent?: string;
  };
  children: VirtualDOMNode[];
}

/**
 * Types of messages that can be received from the WebSocket server
 * 
 * @interface WebSocketMessage
 * @property {typeof MESSAGE_TYPES[keyof typeof MESSAGE_TYPES]} type - Type of message
 * @property {VirtualDOMNode} payload - The virtual DOM structure
 */
interface WebSocketMessage {
  type: typeof MESSAGE_TYPES[keyof typeof MESSAGE_TYPES];
  payload: VirtualDOMNode;
}

/**
 * Actions that can be sent to the WebSocket server to modify the DOM
 * 
 * @interface Action
 * @property {typeof ACTION_TYPES[keyof typeof ACTION_TYPES]} type - Type of modification
 * @property {string} [key] - Target element's key
 * @property {string} [parentKey] - Parent element's key (for add/remove operations)
 * @property {string} [payload] - New text content (for update operations)
 * @property {string} [elementType] - Type of element to add (for add operations)
 * @property {any} [props] - Properties for new element (for add operations)
 */
interface Action {
  type: typeof ACTION_TYPES[keyof typeof ACTION_TYPES];
  key?: string;
  parentKey?: string;
  payload?: string;
  elementType?: string;
  props?: any;
}

const App: React.FC = () => {
  const [virtualDOM, setVirtualDOM] = useState<VirtualDOMNode | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Set up WebSocket connection when component mounts
  useEffect(() => {
    const websocket = new WebSocket(wsEndpoint);

    websocket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    // Handle incoming messages from the server
    websocket.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      if (message.type === MESSAGE_TYPES.INIT_DOM || message.type === MESSAGE_TYPES.UPDATE_DOM) {
        setVirtualDOM(message.payload);
      }
    };

    websocket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    setWs(websocket);

    // Clean up WebSocket connection when component unmounts
    return () => {
      websocket.close();
    };
  }, []);

  /**
   * Sends an action to the WebSocket server
   * 
   * @param {Action} action - The action to send to the server
   * @returns {void}
   */
  const sendAction = (action: Action) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(action));
    }
  };

  /**
   * Updates the title text with current timestamp
   * 
   * @returns {void}
   */
  const handleUpdateTitle = () => {
    sendAction({
      type: ACTION_TYPES.UPDATE_TEXT_CONTENT,
      key: ELEMENT_KEYS.TITLE,
      payload: 'Updated Title ' + new Date().toLocaleTimeString()
    });
  };

  /**
   * Updates the subtitle text with current timestamp
   * 
   * @returns {void}
   */
  const handleUpdateSubtitle = () => {
    sendAction({
      type: ACTION_TYPES.UPDATE_TEXT_CONTENT,
      key: ELEMENT_KEYS.SUBTITLE,
      payload: 'Updated Subtitle ' + new Date().toLocaleTimeString()
    });
  };

  /**
   * Adds a new entry to the content section with current timestamp
   * 
   * @returns {void}
   */
  const handleAddEntry = () => {
    sendAction({
      type: ACTION_TYPES.ADD_CHILD,
      parentKey: ELEMENT_KEYS.CONTENT_CONTAINER,
      key: 'entry-' + Date.now(),
      elementType: 'p',
      props: {
        textContent: 'New entry added at ' + new Date().toLocaleTimeString()
      }
    });
  };

  /**
   * Recursively renders a virtual DOM node and its children
   * 
   * @param {VirtualDOMNode} node - The virtual DOM node to render
   * @returns {React.ReactNode} The rendered React element
   */
  const renderNode = (node: VirtualDOMNode): React.ReactNode => {
    const { type, props, children } = node;
    const { textContent, ...restProps } = props;
    return React.createElement(
      type,
      { ...restProps },
      textContent || children.map(child => renderNode(child))
    );
  };

  // Show loading state while waiting for initial DOM
  if (!virtualDOM) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <div className="controls">
        <button onClick={handleUpdateTitle}>Update Title</button>
        <button onClick={handleUpdateSubtitle}>Update Subtitle</button>
        <button onClick={handleAddEntry}>Add entry</button>
      </div>
      {renderNode(virtualDOM)}
    </div>
  );
};

export default App;
