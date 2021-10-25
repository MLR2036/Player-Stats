async function start()
{
  const data = await loadData();
  const playerData = getPlayerData(data);
  populateDropdown(playerData);
  const playerImageData = getImageData(playerData);
  dispalyPlayerImages(playerImageData);
  displayPlayerStats(playerData);
  dispalyBadge(playerData);  
}

function getAvrage(x, y)
{
  return Math.round((x/y) * 100) / 100
  //need to cater for devision by 0
}

function getPlayerStatsByName(stats, name)
{
  const [stat] = stats.filter(element => element.name === name);
  if(stat)
  {
    return stat.value;
  }
  else{
    return 0;
  } 
}

function getPlayerById(playerData, id)
{
  const [player] = playerData.player.filter(element => element.playerid === id);

  if(player)
  {
    return player;
  }
  else
  {
    return 0;
  }
}


function getPlayerPosition(playerPosition)
{
  let playerPositionArray = playerPosition.split(/\s/g);
  return playerPositionArray[playerPositionArray.length-1];
}

function getPlayerData(data)
{
  return data.players.map(player => {
    return {
      playerid: player.player.id,
      playerPhotoid: `p${player.player.id}`,
      playerName: `${player.player.name.first} ${player.player.name.last}`,
      playerTeamId: player.player.currentTeam.id,
      playPosition: getPlayerPosition(player.player.info.positionInfo),
      playerApperances: getPlayerStatsByName(player.stats,"appearances"), 
      playerGolas: getPlayerStatsByName(player.stats,"goals"), 
      playerAssist: getPlayerStatsByName(player.stats,"goal_assist"),
      playerGoalsPerMatch: getAvrage(getPlayerStatsByName(player.stats,"goals"), getPlayerStatsByName(player.stats,"appearances")),
      playerPassesPerMin: getAvrage((getPlayerStatsByName(player.stats,"fwd_pass") + getPlayerStatsByName(player.stats,"backward_pass")),getPlayerStatsByName(player.stats,"mins_played")) 
    }
  })    
}

function setBadgeSpritePosistion(teamId)
{
  let positionX = 700;
  let positionY = 100;
  
  if(teamId === 1)
  {
    positionX = 1100;
    positionY = 1000;
  }
  else if(teamId === 11)
  {
    positionX = 400;
    positionY = 400;
  }
  else if(teamId === 12)
  {
    positionX = 600;
    positionY = 300;
  }
  else if(teamId === 21)
  {
    positionX = 700;
    positionY = 100;
  }
  else if(teamId === 26)
  {
    positionX = 1200;
    positionY = 1100;
  }
  document.getElementById("badge").style.backgroundPosition = `${positionX}px ${positionY}px`;
}

function getImageData(playerData)
{
  return playerData.map(player =>{
    const playerImage = document.createElement("img");
    playerImage.src = `images/${player.playerPhotoid}.png`    
    playerImage.id = player.playerPhotoid
    return playerImage;
  })
  .map(playerImage =>({
    [playerImage.id]: playerImage

  }))
  .reduce((a,b)=>({...a,...b}))  
}

function getPlayerStatsData(playerData)
{
  return playerData.map(player => ({
    [player.playerid]: {
      apperances: player.playerApperances,
      goals: player.playerGolas,
      assists: player.playerAssist,
      goalsPerMatch: player.playerGoalsPerMatch,
      pasesPerMin: player.playerPassesPerMin
    }
  }))
  .reduce((a,b) =>({...a,...b}))
}

function getCurrentTeam(playerData)
{
  return playerData.map(player => ({
    [player.playerid]:{
      teamId: player.playerTeamId
    }
  }))
  .reduce((a,b) =>({...a,...b}))
}

function dispalyBadge(playerData)
{ 
  const team = getCurrentTeam(playerData)  
  const dropdown = document.getElementById("players");
  const selectedIndex = dropdown.selectedIndex;
  const id = dropdown.options[selectedIndex].id;
  const teamId = team[id].teamId;
  setBadgeSpritePosistion(teamId);
  dropdown.addEventListener("change",() => {
    const selectedIndex = dropdown.selectedIndex;
    const id = dropdown.options[selectedIndex].id;
    const teamId = team[id].teamId;
    setBadgeSpritePosistion(teamId);
  })  
}

function dispalyPlayerImages(playerImageData)
{  
  const dropdown = document.getElementById("players");
  const selectedIndex = dropdown.selectedIndex;
  const id = `p${dropdown.options[selectedIndex].id}`;
  const image = playerImageData[id]; 
  const player = document.getElementById("player")
  player.src = image.src;  
  dropdown.addEventListener("change",() => {
    const selectedIndex = dropdown.selectedIndex;
    const id = `p${dropdown.options[selectedIndex].id}`;
    const image = playerImageData[id];
    player.src = image.src;    
  })  
}

function displayPlayerStats(playerData)
{
  const statData = getPlayerStatsData(playerData);
  const dropdown = document.getElementById("players");
  const selectedIndex = dropdown.selectedIndex;
  const id = dropdown.options[selectedIndex].id;
  const statList = Array.from(document.getElementsByTagName("li")); 
  statList.forEach(element =>{
      const stat = statData[id];      
      const value = stat[element.id];
      const keys = Object.keys(stat);      
      keys.forEach(key =>{
        if(key === element.id)
        {
          element.innerHTML = `${key} ${value}`;
        }
      })
    });

  dropdown.addEventListener("change", () =>{
  const selectedIndex = dropdown.selectedIndex;
  const id = dropdown.options[selectedIndex].id;
  const statList = Array.from(document.getElementsByTagName("li")); 
  statList.forEach(element =>{
      const stat = statData[id];      
      const value = stat[element.id];
      const keys = Object.keys(stat);      
      keys.forEach(key =>{
        if(key === element.id)
        {
          element.innerHTML = `${key} ${value}`;
        }
      })
    });
    })
}

async function loadData()
{
 return fetch("/data")
  .then(response => response.json())
  .then(data => data)
  .catch(console.error());       
}

function populateDropdown(playerData) {  
    
  let dropdown = document.getElementById("players");
  dropdown.selectedIndex = 0;   
  if(playerData)
  {
    // Load Json values into dropdown   
      playerData.forEach(element => {
      let option  = document.createElement("option");
      option.text = element.playerName;
      option.id = element.playerid;      
      dropdown.add(option); 
  })
}
  else
  {
    let noDatatOption = document.createElement("option");
    noDatatOption.text = "no data";
    dropdown.add(defaultOption);
  }
}

start();



