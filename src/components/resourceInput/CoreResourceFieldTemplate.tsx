import {
  ObjectFieldTemplateProps,
} from '@rjsf/utils';

export const  CoreResourceFieldTemplate = (props: ObjectFieldTemplateProps) => {
    return (
        <> 
     <div style={{ display: 'flex', width: '100%' }}><h3 style={{ width: '100%',textAlign:'center', }}>{props.title}</h3></div>
      <div style={{ display: 'flex', width: '100%' }}>

        {props.properties.map((element,index) => (
          <div style={{ width: '100%' }} key={index}>{element.content}</div>
          ))}
      </div>
      </>
    );
  }