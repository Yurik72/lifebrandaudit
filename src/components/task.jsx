import React from 'react';

const Task = ({ task, toogleTaskState, ...props }) => 
        <div className="row">
            <div className="col-1">
            </div>
            <div className="col-8 custom-control  custom-checkbox">
                <input onChange={e => toogleTaskState(task.id)} checked={task.done}  type="checkbox" className="custom-control-input blued" id={`ch${task.id}`}/>
            <label className="custom-control-label" htmlFor={`ch${task.id}`}>{task.title }</label>
            </div>

        </div>

export default Task;