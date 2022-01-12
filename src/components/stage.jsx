import React from 'react';
import Task from './task';

const Stage = ({ stage, toogleTaskState, ...props }) => 
        <div className="container py-2">
            <div className="row">
            <div className="col-2">
                <div className="rounded-circle border text-white bg-dark text-center" style={{ width: '40px', height: '40px', fontSize:'20px' }}>{stage.id}</div>
                </div>
                <div className="col-6" >  
                    <h3>{stage.title}</h3>
                </div>
                <div className="col-4 custom-control  custom-checkbox" >
                <input className="custom-control-input bw" id={`st${stage.id}`} type="checkbox" checked={stage.done} style={{ width: '40px', height: '40px' }} readOnly />
                    <label className="custom-control-label" htmlFor={`st${stage.id}`}></label>
                </div>
            </div>
            {stage.tasks.map(task => <Task key={task.id} task={task} toogleTaskState={toogleTaskState}/>)}
        </div>

export default Stage;