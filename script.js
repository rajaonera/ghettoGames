function loadGames() {
    return JSON.parse(localStorage.getItem('games')) || [];
  }

  function saveGames(games) {
    localStorage.setItem('games', JSON.stringify(games));
  }

  function createGame() {
    const gameName = document.getElementById('gameName').value.trim();
    if (!gameName) {
      alert("Veuillez entrer un nom du jeu.");
      return;
    }

    const tarifInput = prompt("Tarif par match en Ariary ?");
    const tarifParMatch = parseFloat(tarifInput);

    if (isNaN(tarifParMatch) || tarifParMatch <= 0) {
      alert("Tarif invalide. Entrez un nombre positif.");
      return;
    }

    const games = loadGames();
    const newGame = {
      name: gameName,
      tarifParMatch: tarifParMatch,
      players: []
    };

    games.push(newGame);
    saveGames(games);

    document.getElementById('gameName').value = '';
    renderGames();
  updateStatistics();

  }
  document.addEventListener('DOMContentLoaded', () => {
    const modeBtn = document.getElementById('toggleMode');
    
    modeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
  
      // Optionnel : changer l'icône
      if (document.body.classList.contains('dark-mode')) {
        modeBtn.textContent = '☀️';
      } else {
        modeBtn.textContent = '🌙';
      }
    });
  });
  
  function addPlayer(gameIndex) {
    const playerName = prompt("Nom du joueur ?");
    if (!playerName) {
      alert("Nom invalide.");
      return;
    }

    const games = loadGames();
    const newPlayer = {
      name: playerName,
      matchesPlayed: 0,
      halfMatchesPlayed: 0,
      paidAmount: 0
    };

    games[gameIndex].players.push(newPlayer);
    saveGames(games);

    renderGames();
  }

  function updateMatchesPlayed(gameIndex, playerIndex, change, isHalfMatch = false) {
    const games = loadGames();
    const player = games[gameIndex].players[playerIndex];

    if (isHalfMatch) {
      player.halfMatchesPlayed += change;
      if (player.halfMatchesPlayed < 0) player.halfMatchesPlayed = 0;
    } else {
      player.matchesPlayed += change;
      if (player.matchesPlayed < 0) player.matchesPlayed = 0;
    }

    saveGames(games);
    renderGames();
  }

  function showPaymentOptions(gameIndex, playerIndex) {
    const games = loadGames();
    const game = games[gameIndex];
    const player = game.players[playerIndex];

    const totalDue = (player.matchesPlayed + player.halfMatchesPlayed ) * game.tarifParMatch;
    const remaining = totalDue - player.paidAmount;

    if (remaining <= 0) {
      alert(`${player.name} a déjà tout payé.`);
      return;
    }

    const amountInput = prompt(`Combien ${player.name} veut payer ? (Reste : ${remaining})`);
    const amountPaid = parseFloat(amountInput);

    if (isNaN(amountPaid) || amountPaid <= 0) {
      alert("Montant invalide. Entrez un nombre positif.");
      return;
    }

    if (amountPaid > remaining) {
      alert("Le paiement dépasse le reste à payer !");
      return;
    }

    player.paidAmount += amountPaid;
    saveGames(games);
    renderGames();
  }

  function removePlayer(gameIndex, playerIndex) {
    const games = loadGames();
    games[gameIndex].players.splice(playerIndex, 1);
    saveGames(games);
    renderGames();
  }

  function removeGame(gameIndex) {
    const games = loadGames();
    games.splice(gameIndex, 1);
    saveGames(games);
    renderGames();
  }

  function exportGames() {
    const games = JSON.parse(localStorage.getItem('games')) || []; 
    if (games.length === 0) {
      alert("aucune partie a exporter.");
      return;
    }
    const dataStr = JSON.stringify(games,null,2);
    const blob = new Blob([dataStr], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a  = document.createElement('a');
    a.href = url; 
    a.download = 'games_export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert("export termine.");
  }
  
  function importGames(event) {
    const file = event.target.files[0];
    if (!file) {
      alert("aucun fichier selectionne.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const importGames = JSON.parse(e.target.result);
        if(!Array.isArray(importGames)){
            alert("Format invalide");
            return;
        }
        localStorage.setItem('games',JSON.stringify(importGames));
        renderGames;
        alert("Donnees importees avec succes !");
      } catch (error) {
        alert("erreur lors de l' importation : " + error.message);
      }      
    };
    reader.readAsText(file);
  }
function updateStatistics() {
  const games = JSON.parse(localStorage.getItem('games')) || []; 
  if (games.length === 0) {
    alert("aucune partie a exporter.");
    return;
  }
  let totalPlayers = 0 ;
  let totalDue = 0 ; 
  let totalPaid = 0 ;
  
  games.forEach(game =>{
      game.players.forEach(player => {
          totalPlayers ++;
          totalDue += player.matchesPlayed*game.tarifParMatch;
          totalDue += player.halfMatchesPlayed*game.tarifParMatch/2;
          totalPaid +=player.paidAmount;
      });
    });
    document.getElementById('statsContainer').innerHTML = `
       <div class="stat-card"><strong>Joueurs :</strong><br>${totalPlayers}</div>
      <div class="stat-card"><strong>Total du :</strong><br>${totalDue.toLocaleString()} AR</div>
      <div class="stat-card"><strong>Total paye :</strong><br>${totalPaid.toLocaleString()} AR</div>
      `;
      
}

function togglePlayerDetails(playerDiv) {
  playerDiv.classList.toggle('open');
}

  function renderGames() {
    const gameSearch = document.getElementById('gameSearch').value.toLowerCase();
    const playerSearch = document.getElementById('playerSearch').value.toLowerCase();

    const games = loadGames();
    const gamesContainer = document.getElementById('gamesContainer');
    gamesContainer.innerHTML = '';

    games.forEach((game, gameIndex) => {
      if (!game.name.toLowerCase().includes(gameSearch)) return;

      const gameDiv = document.createElement('div');
      gameDiv.className = 'game-card';

      const gameTitle = document.createElement('h2');
      gameTitle.textContent = game.name;
      gameDiv.appendChild(gameTitle);

      const tarifDisplay = document.createElement('p');
      tarifDisplay.textContent = `Tarif par match : ${game.tarifParMatch} Ariary`;
      gameDiv.appendChild(tarifDisplay);

      const addPlayerButton = document.createElement('button');
      addPlayerButton.textContent = "Ajouter";
      addPlayerButton.onclick = () => addPlayer(gameIndex);
      gameDiv.appendChild(addPlayerButton);

      const removeGameButton = document.createElement('button');
      removeGameButton.textContent = "Supprimer";
      removeGameButton.className = 'remove-button';
      removeGameButton.onclick = () => removeGame(gameIndex);
      gameDiv.appendChild(removeGameButton);

      const playersDiv = document.createElement('div');
      playersDiv.style.marginTop = '10px';

      game.players.forEach((player, playerIndex) => {
        if (!player.name.toLowerCase().includes(playerSearch)) return;

        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-card';

        const totalDue = (player.matchesPlayed + player.halfMatchesPlayed / 2) * game.tarifParMatch;
        const remaining = totalDue - player.paidAmount;

        // playerDiv.innerHTML = `
        //   <p><strong>${player.name}</strong></p>
        //   <p>🏐 Matchs joués : </p>
        //   <p>⚽ Demi-matchs joués : ${player.halfMatchesPlayed}</p>
        //   <p>💵 Tarif par match : ${game.tarifParMatch} Ariary</p>
        //   <p>💰 Total dû : ${totalDue} Ariary</p>
        //   <p>💸 Déjà payé : ${player.paidAmount} Ariary</p>
        //   <p>🔻 Reste à payer : ${remaining < 0 ? 0 : remaining} Ariary</p>
        //   <button onclick="updateMatchesPlayed(${gameIndex}, ${playerIndex}, 1)">+1 match</button>
        //   <button class="remove-button" onclick="updateMatchesPlayed(${gameIndex}, ${playerIndex}, -1)">- 1 match</button>
        //   <button onclick="updateMatchesPlayed(${gameIndex}, ${playerIndex}, 1, true)">+ 1/2 match</button>
        //   <button class="remove-button" onclick="updateMatchesPlayed(${gameIndex}, ${playerIndex}, -1, true)">- 1/2 match</button>
        //   <button onclick="showPaymentOptions(${gameIndex}, ${playerIndex})">Payer</button>
        //   <button onclick="removePlayer(${gameIndex}, ${playerIndex})" class="remove-button">Supprimer </button>
        // `;
        playerDiv.innerHTML = `
        <div class="player-summary" onclick="togglePlayerDetails(this.parentElement)">
         <strong> ${player.name} :</strong> [ ${player.matchesPlayed} - ${player.halfMatchesPlayed} ] 
          <br><br> ${totalDue} Ar ( ${remaining} Ar restants)
        </div>
        <div class="player-details">
          <p>Payé : ${player.paidAmount} Ar</p>
          <div class="player-buttons">
            <button onclick="updateMatchesPlayed(${gameIndex}, ${playerIndex}, 1)">+1 match</button>
           <button class="remove-button" onclick="updateMatchesPlayed(${gameIndex}, ${playerIndex}, -1)">- 1 match</button>
           <button onclick="updateMatchesPlayed(${gameIndex}, ${playerIndex}, 1, true)">+ 1/2 match</button>
           <button class="remove-button" onclick="updateMatchesPlayed(${gameIndex}, ${playerIndex}, -1, true)">- 1/2 match</button>
           <button onclick="showPaymentOptions(${gameIndex}, ${playerIndex})">Payer</button>
           <button onclick="removePlayer(${gameIndex}, ${playerIndex})" class="remove-button">Supprimer </button>          </div>
        </div>
      `;
        playersDiv.appendChild(playerDiv);
      });

      gameDiv.appendChild(playersDiv);
      gamesContainer.appendChild(gameDiv);
    });
  }

  renderGames();
  updateStatistics();

