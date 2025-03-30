import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Handle all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index-new.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Create HTTP server
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
});

// WebSocket Server
const wss = new WebSocketServer({ server });

// Player management
const players = new Map();
const matchQueue = [];

wss.on('connection', (ws) => {
    console.log('New player connected');
    
    // Generate unique player ID
    const playerId = Math.random().toString(36).substring(2, 9);
    players.set(playerId, { 
        ws,
        status: 'connected',
        matchId: null
    });

    // Send player their ID
    ws.send(JSON.stringify({
        type: 'player_id',
        data: playerId
    }));

    // Handle messages
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log(`Received from ${playerId}:`, data);

            // Handle different message types
            switch(data.type) {
                case 'join_queue':
                    handleJoinQueue(playerId);
                    break;
                case 'player_answer':
                    handlePlayerAnswer(playerId, data);
                    break;
                // Add more message handlers as needed
            }
        } catch (err) {
            console.error('Error processing message:', err);
        }
    });

    // Handle disconnection
    ws.on('close', () => {
        console.log(`Player ${playerId} disconnected`);
        handleDisconnect(playerId);
        players.delete(playerId);
    });
});

// Matchmaking functions
function handleJoinQueue(playerId) {
    const player = players.get(playerId);
    if (!player) return;

    player.status = 'queued';
    matchQueue.push(playerId);

    // Try to match players
    if (matchQueue.length >= 2) {
        const player1Id = matchQueue.shift();
        const player2Id = matchQueue.shift();
        createMatch(player1Id, player2Id);
    }
}

function createMatch(player1Id, player2Id) {
    const matchId = Math.random().toString(36).substring(2, 9);
    const player1 = players.get(player1Id);
    const player2 = players.get(player2Id);

    if (!player1 || !player2) return;

    player1.status = 'in_match';
    player1.matchId = matchId;
    player2.status = 'in_match';
    player2.matchId = matchId;

    // Notify both players with their respective opponent IDs
    player1.ws.send(JSON.stringify({
        type: 'match_found',
        data: {
            matchId,
            opponentId: player2Id
        }
    }));

    player2.ws.send(JSON.stringify({
        type: 'match_found',
        data: {
            matchId,
            opponentId: player1Id
        }
    }));
}

function handlePlayerAnswer(playerId, data) {
    const player = players.get(playerId);
    if (!player || !player.matchId) return;

    // Broadcast answer to opponent
    const opponentId = [...players].find(([id, p]) => 
        p.matchId === player.matchId && id !== playerId
    )?.[0];

    if (opponentId) {
        players.get(opponentId)?.ws.send(JSON.stringify({
            type: 'opponent_answer',
            data: {
                answer: data.answer,
                isCorrect: data.isCorrect
            }
        }));
    }
}

function handleDisconnect(playerId) {
    const player = players.get(playerId);
    if (!player || !player.matchId) return;

    // Notify opponent if in match
    const opponentId = [...players].find(([id, p]) => 
        p.matchId === player.matchId && id !== playerId
    )?.[0];

    if (opponentId) {
        players.get(opponentId)?.ws.send(JSON.stringify({
            type: 'opponent_disconnected'
        }));
        players.get(opponentId).matchId = null;
        players.get(opponentId).status = 'connected';
    }
}
