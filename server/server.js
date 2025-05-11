/**
 * WebSocket Server for Real-time DOM Updates
 * 
 * This server implements a virtual DOM synchronization system using WebSockets.
 * It maintains a server-side representation of the DOM and handles real-time
 * updates between clients.
 */

const WebSocket = require('ws');

// Create WebSocket server instance
// Default port is 8080, can be overridden by PORT environment variable
const wss = new WebSocket.Server({ 
  port: process.env.PORT || 8080,
  path: '/ws'
});

/**
 * Initial Virtual DOM Structure
 * Represents the starting state of the application's DOM tree
 * Each node contains:
 * - type: HTML element type
 * - props: Element properties including className and key
 * - children: Array of child nodes
 */
let virtualDOM = {
    type: 'div',
    props: { className: 'container', key: 'root-container' },
    children: [
        {
            type: 'div',
            props: { className: 'header', key: 'header-container' },
            children: [
                { type: 'h1', props: { key: 'title', textContent: 'Initial Title' }, children: [] },
                { type: 'p', props: { key: 'subtitle', textContent: 'Hello World' }, children: [] }
            ]
        },
        {
            type: 'div',
            props: { className: 'content', key: 'content-container' },
            children: [
                { type: 'p', props: { key: 'entry-1', textContent: 'First entry' }, children: [] },
                { type: 'p', props: { key: 'entry-2', textContent: 'Second entry' }, children: [] }
            ]
        }
    ],
};

/**
 * Finds a node in the virtual DOM tree by its key
 * @param {Object} vdom - The virtual DOM tree to search
 * @param {string} key - The key to search for
 * @returns {Object|null} The found node or null if not found
 */
function findNodeByKey(vdom, key) {
    if (vdom.props?.key === key) {
        return vdom;
    }

    for (const child of vdom.children || []) {
        const found = findNodeByKey(child, key);
        if (found) return found;
    }

    return null;
}

/**
 * Applies an action to the virtual DOM and returns a new updated version
 * @param {Object} action - The action to apply
 * @param {string} action.type - Type of action (UPDATE_TEXT_CONTENT, ADD_CHILD, REMOVE_CHILD)
 * @param {string} action.key - Key of the target node
 * @param {Object} vdom - Current virtual DOM state
 * @returns {Object} New virtual DOM state
 */
function applyAction(action, vdom) {
    const newVdom = structuredClone(vdom);

    switch (action.type) {
        case 'UPDATE_TEXT_CONTENT':
            const node = findNodeByKey(newVdom, action.key);
            if (node) {
                node.props.textContent = action.payload;
            }
            break;

        case 'ADD_CHILD':
            const parentNode = findNodeByKey(newVdom, action.parentKey);
            if (parentNode) {
                parentNode.children.push({
                    type: action.elementType,
                    props: { ...action.props, key: action.key },
                    children: []
                });
            }
            break;

        case 'REMOVE_CHILD':
            const parent = findNodeByKey(newVdom, action.parentKey);
            if (parent) {
                parent.children = parent.children.filter(child => child.props.key !== action.key);
            }
            break;
    }

    return newVdom;
}

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('Client connected');

    // Send initial DOM state to new client
    ws.send(JSON.stringify({ type: 'INIT_DOM', payload: virtualDOM }));

    // Handle incoming messages from client
    ws.on('message', (message) => {
        const action = JSON.parse(message);
        console.log('Received action:', action);

        // Apply the action and update the virtual DOM
        const updatedDOM = applyAction(action, virtualDOM);
        virtualDOM = updatedDOM;

        // Send updated DOM back to client
        ws.send(JSON.stringify({ type: 'UPDATE_DOM', payload: updatedDOM }));
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Export for Vercel deployment
module.exports = wss;
