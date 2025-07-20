require('dotenv').config();
const { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const P = require('pino');
const fs = require('fs');
const path = require('path');

// Número autorizado (formato internacional, sem +, só números)
const AUTHORIZED_NUMBER = '5511998289081';

// Inicializar o Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getGeminiResponse(message) {
    try {
        console.log('[Gemini] Chave da API:', process.env.GEMINI_API_KEY ? 'Configurada' : 'NÃO CONFIGURADA');
        console.log('[Gemini] Enviando mensagem para a API:', message);
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();
        
        console.log('[Gemini] Resposta recebida:', text);
        return text.trim();
    } catch (error) {
        console.error('[Gemini] Erro ao consultar Gemini:', error.message, error.stack);
        return 'Desculpe, houve um erro ao consultar o Gemini.';
    }
}

const qrcode = require('qrcode-terminal');

async function startBot() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
        const { version } = await fetchLatestBaileysVersion();
        const sock = makeWASocket({
            version,
            auth: state,
            logger: P({ level: 'info' })
        });

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('messages.upsert', async ({ messages, type }) => {
            try {
                if (type !== 'notify') return;
                const msg = messages[0];
                if (!msg.message || !msg.key.remoteJid) return;

                // Extrai número do remetente
                const sender = msg.key.remoteJid.split('@')[0];
                console.log('[Mensagem recebida] De:', sender, 'Conteúdo:', msg.message);
                if (sender !== AUTHORIZED_NUMBER) {
                    console.log('[Mensagem ignorada] Número não autorizado:', sender);
                    return; // Só responde ao número autorizado
                }

                let text = '';
                if (msg.message.conversation) {
                    text = msg.message.conversation;
                } else if (msg.message.extendedTextMessage) {
                    text = msg.message.extendedTextMessage.text;
                }
                if (!text) {
                    console.log('[Mensagem ignorada] Sem texto detectado.');
                    return;
                }

                // Indica que está digitando
                await sock.sendPresenceUpdate('composing', msg.key.remoteJid);
                const reply = await getGeminiResponse(text);
                await sock.sendMessage(msg.key.remoteJid, { text: reply }, { quoted: msg });
                console.log('[Mensagem enviada] Para:', sender, 'Resposta:', reply);
            } catch (err) {
                console.error('[Erro em messages.upsert]:', err.stack || err);
            }
        });

        sock.ev.on('connection.update', async (update) => {
            try {
                const { connection, lastDisconnect, qr } = update;
                if (qr) {
                    qrcode.generate(qr, { small: true });
                    console.log('[QR] Escaneie este QR code com o WhatsApp:');
                }
                if (connection === 'close') {
                    const reason = lastDisconnect?.error?.output?.statusCode;
                    console.log('[Conexão] Fechada. Motivo:', reason, '-', DisconnectReason[reason] || 'desconhecido');
                    
                    // Se for loggedOut, apaga a autenticação antiga e reconecta
                    if (reason === DisconnectReason.loggedOut) {
                        console.log('[Conexão] Sessão expirada. Apagando autenticação antiga...');
                        try {
                            if (fs.existsSync('auth_info_baileys')) {
                                fs.rmSync('auth_info_baileys', { recursive: true, force: true });
                                console.log('[Conexão] Autenticação antiga removida.');
                            }
                        } catch (err) {
                            console.error('[Erro ao remover autenticação]:', err);
                        }
                        console.log('[Conexão] Tentando reconectar em 3 segundos...');
                        await new Promise(res => setTimeout(res, 3000));
                        startBot();
                    }
                    // Se for restartRequired, reconecta automaticamente
                    else if (reason === DisconnectReason.restartRequired) {
                        console.log('[Conexão] Restart necessário após pairing. Reconectando...');
                        console.log('[Conexão] Tentando reconectar em 2 segundos...');
                        await new Promise(res => setTimeout(res, 2000));
                        startBot();
                    }
                    // Só reconecta se não for erro crítico
                    else if (
                        reason !== DisconnectReason.badSession &&
                        reason !== DisconnectReason.connectionReplaced &&
                        reason !== DisconnectReason.multideviceMismatch
                    ) {
                        console.log('[Conexão] Tentando reconectar em 5 segundos...');
                        await new Promise(res => setTimeout(res, 5000));
                        startBot();
                    } else {
                        console.log('[Conexão] Reconexão não será tentada automaticamente. Motivo crítico.');
                    }
                } else if (connection === 'open') {
                    console.log('[Conexão] Bot conectado!');
                }
            } catch (err) {
                console.error('[Erro em connection.update]:', err.stack || err);
            }
        });
    } catch (err) {
        console.error('[Erro ao iniciar bot]:', err.stack || err);
        console.log('[Bot] Tentando reiniciar em 10 segundos...');
        await new Promise(res => setTimeout(res, 10000));
        startBot();
    }
}

startBot(); 