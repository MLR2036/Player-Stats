async function start()
{
  const data = await loadData();
  const playerData = getPlayerData(data);
  populateDropdown(playerData);
  const playerImageData = getImageData(playerData);
  dispalyPlayerImages(playerImageData);
  displayPlayerStats(playerData);
  getBadge()
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
      playerTeamid: player.player.currentTeam.id,
      playPosition: getPlayerPosition(player.player.info.positionInfo),
      playerApperances: getPlayerStatsByName(player.stats,"appearances"), 
      playerGolas: getPlayerStatsByName(player.stats,"goals"), 
      playerAssist: getPlayerStatsByName(player.stats,"goal_assist"),
      playerGoalsPerMatch: getAvrage(getPlayerStatsByName(player.stats,"goals"), getPlayerStatsByName(player.stats,"appearances")),
      playerPassesPerMin: getAvrage((getPlayerStatsByName(player.stats,"fwd_pass") + getPlayerStatsByName(player.stats,"backward_pass")),getPlayerStatsByName(player.stats,"mins_played")) 
    }
  })    
}

function getBadge(teamId)
{
  let positionX = 600;
  let positionY = 1100;
  
  if(teamId === 1)
  {
    positionX = 200;
    positionY = 200;
  }
  else if(teamId === 11)
  {
    positionX = 900;
    positionY = 800;
  }
  else if(teamId === 12)
  {
    positionX = 700;
    positionY = 900;
  }
  else if(teamId === 21)
  {
    positionX = 600;
    positionY = 1100;
  }
  else if(teamId === 26)
  {
    positionX = 100;
    positionY = 100;
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
    [player.playerPhotoid]: {
      apperances: player.playerApperances,
      goals: player.playerGolas,
      assists: player.playerAssist,
      goalsPerMatch: player.playerGoalsPerMatch,
      pasesPerMin: player.playerPassesPerMin
    }
  }))
  .reduce((a,b) =>({...a,...b}))
}

function dispalyPlayerImages(playerImageData)
{  
  const dropdown = document.getElementById("players");
  const selectedIndex = dropdown.selectedIndex;
  const id = dropdown.options[selectedIndex].id;
  const image = playerImageData[id]; 
  const player = document.getElementById("player")
  player.src = image.src;
  dropdown.addEventListener("change",() => {
    const selectedIndex = dropdown.selectedIndex;
    const id = dropdown.options[selectedIndex].id;
    const image = playerImageData[id];
    player.src = image.src;
    console.log(id)
  })  
}

function displayPlayerStats(playerData)
{
  const statData = getPlayerStatsData(playerData);
  const dropdown = document.getElementById("players");
  const selectedIndex = dropdown.selectedIndex;
  const id = dropdown.options[selectedIndex].id;
  const statList = Array.from(document.getElementsByTagName("li"));
  console.log(statList)
  statList.forEach(element =>{
      const stat = statData[id];      
      const value = stat[element.id];
      const keys = Object.keys(stat);
      console.log(value)
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
  console.log(statList)
  statList.forEach(element =>{
      const stat = statData[id];      
      const value = stat[element.id];
      const keys = Object.keys(stat);
      console.log(value)
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
      option.id = element.playerPhotoid;
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



