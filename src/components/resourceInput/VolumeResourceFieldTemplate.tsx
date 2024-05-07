import {
  ObjectFieldTemplateProps,
} from '@rjsf/utils';

export const  VolumeResourceFieldTemplate = (props: ObjectFieldTemplateProps) => {
    return (
        <> 
     <div style={{ display: 'flex', width: '100%' }}><h3 style={{ width: '100%',textAlign:'center', }}>{props.title}</h3></div>
      <div style={{ display: 'flex', width: '100%' }}>

        {props.properties.map((element) => (
        element.name!='spec'? <div style={{ width: '100%', margin:'8px'}}>{element.content}</div>:<></>
          ))}
      </div>
      <div style={{ display: 'flex', width: '100%' }}>
      {props.properties.map((element) => (
        element.name=='spec'? <div style={{ width: '100%', margin:'8px'}}>{element.content}</div>:<></>
          ))}
      </div>
      </>
    );
  }