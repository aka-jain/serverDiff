const WebSocket = require('ws');

// Create WebSocket server
const wss = new WebSocket.Server({ 
  port: process.env.PORT || 8080,
  path: '/ws'
});

// Initial DOM
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

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.send(JSON.stringify({ type: 'INIT_DOM', payload: virtualDOM }));

    ws.on('message', (message) => {
        const action = JSON.parse(message);
        console.log('Received action:', action);

        const updatedDOM = applyAction(action, virtualDOM);
        virtualDOM = updatedDOM;

        ws.send(JSON.stringify({ type: 'UPDATE_DOM', payload: updatedDOM }));
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Export for Vercel
module.exports = wss;
