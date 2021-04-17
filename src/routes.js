const express = require("express")
const routes = express.Router()

const profile = {
    name: "Gomes",
    avatar: "https://github.com/dev-gomes.png",
    "hours-per-day": 5,
    "monthly-budget": 3000,
    "days-per-week": 5,
    "vacation-per-year": 4,
    "value-hour": 75
}

// { name: 'App', 'daily-hours': '2', 'total-hours': '2' }
const jobs = [
    {
        id: 1,
        name: "Pizaria Guloso",
        "daily-hours": 2,
        "total-hours": 3,
        created_at: Date.now(),
    },
    {
        id: 2,
        name: "Facebook",
        "daily-hours": 47,
        "total-hours": 47,
        created_at: Date.now(),
    }
]

// função que calcula os dias restantes
function remainingDays(job){
    // calculo de tempo restante
    const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed()

    const createdDate = new Date(job.created_at)
    const dueDay = createdDate.getDate() + Number(remainingDays)
    const dueDateInMs = createdDate.setDate(dueDay)

    const timeDiffInMs = dueDateInMs - Date.now()
    // transformar ms em dias
    const dayInMs = 1000 * 60 * 60 * 24
    const dayDiff = Math.floor(timeDiffInMs / dayInMs)

    //restam x dias
    return dayDiff
}

// url base dos arquivos
const views = __dirname + "/views/"

// resquest, response

routes.get("/", (req, res) => {
    // semelhante ao forEach retorna um novo objeto
    const updatedJobs = jobs.map((job) => {
        // ajustes no job
        const remaining = remainingDays(job)
        const status = remaining <= 0 ? "done" : "progress" // se os dias restantes forem menor ou = a zero, será "done" (finalziado) se não será "progress" (trabalhando)

        return {
            ...job, // retorna o objeto completo, e adicona os próximos items
            remaining,
            status,
            budget: profile["value-hour"] * job["total-hours"] // valor total do projeto em R$
        }
    })
    return res.render(views + "/index", { jobs: updatedJobs })
})

routes.get("/job", (req, res) => res.render(views + "/job"))
routes.post("/job", (req, res) => {
                                // ? - se existir prossiga
    const lastId = [jobs.length - 1]?.id || 1; // se não existir, insira o 1    

    jobs.push({
        id: lastId + 1,
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
        created_at: Date.now() // atribuindo data atual
    })
    return res.redirect("/")

})

routes.get("/job/edit", (req, res) => res.render(views + "/job-edit"))
routes.get("/profile", (req, res) => res.render(views + "/profile", { profile }))


// exporta as rotas
module.exports = routes;