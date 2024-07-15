console.log("Script loaded aaa");

function generateKey(seed, length) {
    let random = new Random(seed);
    let key = [];
    for (let i = 0; i < length; i++) {
        key.push(random.nextInt(0, 255));
    }
    return key;
}

function xorEncrypt(text, key) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    let result = [];
    for (let i = 0; i < data.length; i++) {
        result.push(data[i] ^ key[i % key.length]);
    }
    return new Uint8Array(result);
}

function xorDecrypt(data, key) {
    let result = [];
    for (let i = 0; i < data.length; i++) {
        result.push(data[i] ^ key[i % key.length]);
    }
    const decoder = new TextDecoder();
    return decoder.decode(new Uint8Array(result));
}

function base64Encode(arrayBuffer) {
    let binary = '';
    let bytes = new Uint8Array(arrayBuffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function base64Decode(base64) {
    let binary = atob(base64);
    let bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

function shuffleEncrypt(text, seed) {
    let random = new Random(seed);
    let indexes = Array.from(Array(text.length).keys());
    random.shuffle(indexes);
    let shuffled = indexes.map(i => text[i]).join('');
    return { shuffled, indexes };
}

function shuffleDecrypt(text, indexes) {
    let result = Array(text.length);
    indexes.forEach((idx, i) => result[idx] = text[i]);
    return result.join('');
}

class Random {
    constructor(seed) {
        this.seed = seed;
    }

    nextInt(min, max) {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return Math.floor(min + (this.seed / 233280.0) * (max - min));
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = this.nextInt(0, i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

function performAction(action) {
    console.log(`Action: ${action}`);
    const text = document.getElementById('inputText').value;
    const seed = parseInt(document.getElementById('seed').value);
    
    if (!text || isNaN(seed)) {
        alert("Please enter valid text and month.");
        return;
    }
    
    if (action === 'purple') {
        purple(text, seed);
    } else if (action === 'pink') {
        pink(text, seed);
    }
}

function purple(text, seed) {
    console.log("Performing purple action");
    const key = generateKey(seed, text.length);
    const xorEncrypted = xorEncrypt(text, key);
    const base64Encrypted = base64Encode(xorEncrypted);
    const { shuffled, indexes } = shuffleEncrypt(base64Encrypted, seed);
    const indexesStr = indexes.join(',');
    const finalEncrypted = shuffled + "|" + indexesStr;
    document.getElementById('outputText').value = finalEncrypted;
}

function pink(text, seed) {
    console.log("Performing pink action");
    const parts = text.split('|');
    if (parts.length !== 2) {
        alert("Invalid format.");
        return;
    }
    
    const encryptedPart = parts[0];
    const indexes = parts[1].split(',').map(Number);

    const base64Decrypted = shuffleDecrypt(encryptedPart, indexes);
    const xorEncrypted = base64Decode(base64Decrypted);
    const key = generateKey(seed, xorEncrypted.length);
    const decryptedText = xorDecrypt(xorEncrypted, key);

    document.getElementById('outputText').value = decryptedText;
}
