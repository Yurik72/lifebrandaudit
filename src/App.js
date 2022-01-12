import React from 'react';
import { observer } from 'mobx-react';
import Stage from './components/stage';
import FinalResult from './components/finalresult';
import  './App.css';


const App = observer(({ storage })=> {
    const { sortedStagesWithTask, toogleTaskState, allDone,reset } = storage;
   
    return (
            <>
            <div className="container shadow my-2">
                
                {sortedStagesWithTask.map(stage => (
                    <Stage
                        toogleTaskState={toogleTaskState}
                        stage={stage}
                        key={stage.id}
                    ></Stage>
                ))}
            </div>
            {allDone && <FinalResult reset={ reset}/>}
            </>
        );
    })

//ReactDOM.render(<App storage={store } />, document.getElementById('root'));
export default App