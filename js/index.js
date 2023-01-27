const times = document.querySelector('.times')
const section = document.querySelector('.barra')
const main = document.querySelector('.main')


const fetchNBA = async (team) =>{
    const APIresponse = await fetch(`https://api.sportsdata.io/v3/nba/scores/json/Players/${team}?key=7f6834cac52b4a70a3eb35a373418fbd`)
    if (APIresponse.status == 200){
        const data = await APIresponse.json()
        return data
    }
}

const fetchNBATimes = async ()=>{
    const APIresponse = await fetch(`https://api.sportsdata.io/v3/nba/scores/json/teams?key=7f6834cac52b4a70a3eb35a373418fbd`)
    if (APIresponse.status == 200){
        const dataTimes= await APIresponse.json()
        return dataTimes
    }
}

const fetchNBAStats = async (season, teamid)=>{
    const APIresponse = await fetch(`https://api.sportsdata.io/v3/nba/scores/json/TeamGameStatsBySeason/${season}/${teamid}/all?key=7f6834cac52b4a70a3eb35a373418fbd`)
    if (APIresponse.status == 200){
        const dataStats= await APIresponse.json()
        return dataStats
    }
}



const mainNBA = async () =>{
    
    const dataTimes = await fetchNBATimes()

    if(dataTimes){
        console.log(dataTimes)
        
        dataTimes.forEach(chave =>{
            const timesLogo = document.createElement('div')
            const teamImg = document.createElement('img')
            
            timesLogo .classList.add('times')
            teamImg.classList.add('logos')
            
            teamImg.src = chave.WikipediaLogoUrl
            timesLogo.appendChild(teamImg)
            timesLogo.setAttribute('id', chave.Key);
            section.appendChild(timesLogo)

            timesLogo .addEventListener('click', ()=>{
                timeNBA(timesLogo.id, chave.WikipediaLogoUrl, chave.City, chave.Conference, chave.Name, chave.TeamID)
            })

        })
        
        
        
        
        
        
        
        
        
        
        
    }
    

   
    
    
    

}

const timeNBA = async (team, teamImg, city, conf, Nome, ID) =>{
    const data = await fetchNBA(team)
    const dataStats = await fetchNBAStats(2022, ID)
    console.log(data)
    console.log(dataStats)
    main.innerHTML = ''
    
    if(data){  
        const times = document.createElement('div')
        times.classList.add('main-times')
        const infos = document.createElement('div')
        infos.classList.add('main-infos')
        const LogoImg = document.createElement('img')
        LogoImg.src = teamImg
        LogoImg.classList.add('main-logo')
        const mainCity = document.createElement('span')
        mainCity.innerHTML = `Cidade:  ${city}`
        mainCity.classList.add('main-cidade')
        const mainConf = document.createElement('span')
        mainConf.innerHTML = `Conferência:  ${conf}`
        mainConf.classList.add('main-conf')
        const mainName = document.createElement('span')
        mainName.innerHTML = `Nome:  ${Nome}`
        mainName.classList.add('main-nome')
        
        const graphs = document.createElement('div')
        graphs.classList.add('graphs')
        

        const seasonMap = dataStats.map(mapGameLogs)
        const seasonMedia = calcMediaArray(seasonMap)
        

        console.log(seasonMedia)
        

        google.charts.load('current', {packages: ['corechart']})
        google.charts.setOnLoadCallback(drawChart)

        function drawChart(){
            const data = new google.visualization.arrayToDataTable([
                ['Wins', 'Losses'],
                ['Wins', seasonMedia[0]],
                ['Losses', seasonMedia[1]]
            ])
            var options = {
                backgroundColor: 'none',
                colors: ['rgb(12, 12, 190)','rgb(168, 34, 34)'],
                height: 400,
                width: 700,
                titleTextStyle: {
                    color: 'white',
                },
                legend: {
                    textStyle: {
                        color: 'white',
                        fontSize: 17,   
                    },
                },

            }

            const chart = new google.visualization.PieChart(graphs)
            chart.draw(data, options)
        }

        
        infos.appendChild(LogoImg)
        infos.appendChild(mainName)
        infos.appendChild(mainCity)
        infos.appendChild(mainConf)
        times.appendChild(infos)
        main.appendChild(times)
        main.appendChild(graphs)

        
        const mainPlayer = document.createElement('div')
        mainPlayer.classList.add('main-players')
        const players = document.createElement('div')
        players.classList.add('players')
        const titleElenco = document.createElement('h2')
        titleElenco.classList.add('h2')
        titleElenco.innerHTML = 'Elenco'
        data.forEach(chave2 => {
            
            const infoplayer = document.createElement('div')
            infoplayer.classList.add('infosplayer')
            const player = document.createElement('img')
            player.classList.add('player')
            const namePlayer = document.createElement('span')
            namePlayer.classList.add('name-player')

            
            
            namePlayer.innerHTML = chave2.FanDuelName
            player.src = chave2.PhotoUrl


            infoplayer.appendChild(player)
            infoplayer.appendChild(namePlayer)
            players.appendChild(infoplayer)
            mainPlayer.appendChild(titleElenco)
            mainPlayer.appendChild(players)
            
            main.appendChild(mainPlayer)


        })

       
        
        

    }
}


const mapGameLogs =(e) =>{
    return [e.Wins, e.Losses]
}

function calcMediaArray(arrays) {
    return arrays.reduce((acc, array) => acc.map((sum, i) => sum + array[i]), new Array(arrays[0].length).fill(0));
}



mainNBA()

