let button = document.getElementById("search-btn")

button.addEventListener("submit",(e)=>{
    e.preventDefault()

    let username = document.getElementById("userName").value 

    if(username){
        fetchUserInfoFromGitHub(username)
        fetchRepo(username,1)
        
    }
})


async function fetchUserInfoFromGitHub(username){
    let responce = await fetch(`https://api.github.com/users/${username}`)
    let data = await responce.json()
    
    let resultOverview = document.querySelector(".overview")

    resultOverview.innerHTML = `
        <div>
            <img width="150px" height="150px" src="${data.avatar_url}" />
            <h2>${data.login}</h2>
            <p>Followers: ${data.followers}</p>
            <p>Following: ${data.following}</p>
            <p>Public Repo: ${data.public_repos}</p>
        </div>
    `
}
// console.log(fetchUserInfoFromGitHub("ankit"));


async function fetchRepo(username,page){
    let data = await fetch(`https://api.github.com/users/${username}/repos?per_page=6&page=${page}`) 
    
    let userRepo = await data.json()
    console.log(userRepo);

    let repoList = userRepo.map((repo)=>
        `
        <div>
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>

            <p>Description: ${repo.description || "no Description available"}</p>
        </div>
        `
    ).join(" ")

    let repo = document.querySelector(".repos")
    repo.innerHTML = repoList

    fetchTotalRepo(username).then(totalRepo => setPagination(username,page,totalRepo))

}

function fetchTotalRepo(username){
    return fetch(`https://api.github.com/users/${username}`).then(responce => responce.json())
    .then((data)=> data.public_repos)
}
// console.log(fetchRepo("ankit"));


// 2nd Method

function setPagination(username,page,totalRepo){
    let pagination = document.getElementById("pagination")
    pagination.innerHTML = " "
    let totalPage = Math.ceil(totalRepo/6)

    const createBtn = (text,currentPage)=>{
        let btn = document.createElement("button")
        btn.textContent = text
        btn.onclick = function(){
            fetchRepo(username,currentPage)
        }
        return btn
    }

    let prevBtn = createBtn("Prev",page-1)
    prevBtn.disabled = page === 1
    pagination.appendChild(prevBtn)

    const maxBtn = 5;
    let start = Math.max(1,page - Math.floor(maxBtn/2))
    let end = Math.min(totalPage,start + maxBtn - 1)

    for(let i=start; i<=end; i++){
        let btn = createBtn(i,i)
        btn.disabled = i===page
        pagination.appendChild(btn)
    }

    let nextBtn = createBtn("Next",page+1)
    nextBtn.disabled = page===totalPage
    pagination.appendChild(nextBtn)
}



// here we use setPagination METHOD - 1     HardCoding done here

// in this code display af all button on refresh it create pagination button again again on refresh or selecting diff username 

// function setPagination(username,page){
//     let totalRepo = 86;
//     var btnCount = Math.ceil(totalRepo/6);

//     let pagination = document.getElementById("pagination")      
//     let prevBtn = document.createElement("button")           // Prev Button
//     prevBtn.textContent = "Prev"
//     prevBtn.onclick = function(){
//         fetchRepo(username,page-1)
//     }

//     pagination.appendChild(prevBtn)  

//     for(let i=0; i<=btnCount; i++){             // creating all buttons btncount
//         let btn = document.createElement("button")
//         btn.textContent = i
//         btn.onclick = function(){
//             fetchRepo(username,i)
//         }
//         pagination.appendChild(btn)
//     }

//     let nextBtn = document.createElement("button")         // next button
//     nextBtn.textContent = "Next"       
//     nextBtn.onclick = function(){
//         fetchRepo(username,page+1)
//     }
//     pagination.appendChild(nextBtn)
// }