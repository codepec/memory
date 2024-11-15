function saveSettings() {
    const difficulty = document.getElementById('difficulty').value;
    const soundEnabled = document.getElementById('sound').checked;
    const timerEnabled = document.getElementById('timer').checked;
    const bgMusicEnabled = document.getElementById('bg-music').checked;

    // Save settings to localStorage or apply them immediately
    localStorage.setItem('difficulty', difficulty);
    localStorage.setItem('soundEnabled', soundEnabled);
    localStorage.setItem('timerEnabled', timerEnabled);
    localStorage.setItem('bgMusicEnabled', bgMusicEnabled);

    alert('Settings saved!');
}

