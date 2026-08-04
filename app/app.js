document.addEventListener('DOMContentLoaded', () => {
    const uptimeEl = document.getElementById('uptime-counter');
    let totalSeconds = 312;

    setInterval(() => {
        totalSeconds++;
        const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const secs = String(totalSeconds % 60).padStart(2, '0');
        if (uptimeEl) {
            uptimeEl.textContent = `${hrs}:${mins}:${secs}`;
        }
    }, 1000);

    const refreshBtn = document.getElementById('refresh-btn');
    const diagLog = document.getElementById('diagnostic-log');

    const sampleLogs = [
        "inspecting OrbStack container socket... [SUCCESS]",
        "checking volume persistent storage mounted at /data... [ALIVE]",
        "validating network namespace isolation... [ENFORCED]",
        "testing hot-reload reactivity... [VERIFIED]",
        "executing healthcheck curl target on port 80... [HTTP 200 OK]"
    ];

    if (refreshBtn && diagLog) {
        refreshBtn.addEventListener('click', () => {
            refreshBtn.disabled = true;
            refreshBtn.textContent = 'Running...';
            
            const newLog = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.innerHTML = `<span class="prompt">$</span> ${newLog}`;
            
            diagLog.appendChild(line);
            diagLog.scrollTop = diagLog.scrollHeight;

            setTimeout(() => {
                refreshBtn.disabled = false;
                refreshBtn.textContent = 'Run Diagnostic';
            }, 500);
        });
    }

    const cpuVal = document.getElementById('cpu-val');
    const cpuFill = document.querySelector('.progress-fill');

    setInterval(() => {
        const randomCpu = (0.8 + Math.random() * 2.4).toFixed(1);
        if (cpuVal && cpuFill) {
            cpuVal.textContent = `${randomCpu}%`;
            cpuFill.style.width = `${Math.min(randomCpu * 8, 100)}%`;
        }
    }, 3000);
});
