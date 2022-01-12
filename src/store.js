import { makeAutoObservable } from 'mobx';

const init_tasks = [
    { id: 1,stageid:1, title: 'Setup virtual office', done: false },
    { id: 2, stageid: 1, title: 'Set mission & vision', done: false },
    { id: 3, stageid:1, title: 'Select business name', done: false },
    { id: 4, stageid:1, title: 'Buy domains', done: false },
    { id: 5, stageid:2,title: 'Create road map', done: false },
    { id: 6, stageid: 2, title: 'Competitor Analysis', done: false },
    { id: 7, stageid:3, title: 'Release marketing web site', done: false },
    { id: 8, stageid: 3, title: 'Release MVP', done: false },
]
const init_stages = [
    { id: 1, title: 'Foundation' },
    { id: 2, title: 'Discovery' },
    { id: 3, title: 'Delivery' }
]
const tasks_storage_name = "tasks"
const stages_storage_name = "stages"
class Store {
    constructor() {
        makeAutoObservable(this)
        this.toogleTaskState = this.toogleTaskState.bind(this)
        this.reset = this.reset.bind(this)
        // TODO: bind other functions, which will be used on handlers
        console.log('Store ctor')  
    }
    
    tasks = JSON.parse(localStorage.getItem(tasks_storage_name)) || [...init_tasks];
    stages = JSON.parse(localStorage.getItem(stages_storage_name)) || [...init_stages];


    /* returns sorted stages by id asc
        TODO: implement other sorting criteria, for instance by index to be independable from database level
    */
    get sortedStages() {
        const stages = this.stages;
        return stages.slice().sort((a, b) => (a.id > b.id));
    }
    /* the same as sortedStages*/
    get sortedTasks() {
        const tasks = this.tasks;
        return tasks.slice().sort((a, b) => (a.id > b.id));
    }
    /* returns sorted stages with their's assigned tasks
       can be main function, when server returns complex object
       TODO: check if need persistance of stage.done
    */
    get sortedStagesWithTask() {
        const stages = this.sortedStages;
        const tasks = this.sortedTasks;
        return stages.map(stage => {
            return {
                ...stage,
                done: tasks.filter(task => task.stageid === stage.id && !task.done).length===0,
                tasks: tasks.filter(task => task.stageid === stage.id)
                }
        })
    }
    setTasks(payload,savetostorage=true) {
        this.tasks = [...payload];
        if (savetostorage) {
            localStorage.setItem(tasks_storage_name, JSON.stringify(this.tasks))
            //localStorage.setItem(stages_storage_name, JSON.stringify(this.stages)) // not need by this implementation
        }

    }
    /* checks, if task state (done) can be changed, based on the stages states
        TODO: change sequence criteria  of stages,currently by id
     */ 
    canToggleTaskState = (task) =>task
             && this.tasks.filter(t => t.stageid < task.stageid && !t.done).length === 0  //previuos stages must be done
             && this.tasks.filter(t => t.stageid > task.stageid && t.done).length === 0 //next stages must be NOT done 
    toogleTaskState(id) {
        let tasks = this.tasks;
        const index = tasks.map(task => task.id).indexOf(id);
        let task = tasks[index]
        if (!this.canToggleTaskState(task)) {
            // TODO: change UI behaviour to inform user
            console.warn('Task state can not be changed for this stage', task)
            return false
        }

        task.done = !task.done;
        this.setTasks(tasks);
        return true
        
    }
    get allDone() {
        return this.tasks.filter(task => !task.done).length===0
    }
    reset() {
        this.setTasks(init_tasks)
    }


    
}

export default new Store();