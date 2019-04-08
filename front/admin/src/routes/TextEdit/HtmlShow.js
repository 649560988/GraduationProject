import React,{ Component, Fragment} from 'react'
import { isConstructorDeclaration } from 'typescript';
class HtmlShow extends Component{
    constructor(props){
        super(props)
        this.state={
        }
    }
    render(){
        return(
            <Fragment>
                <div dangerouslySetInnerHTML={{__html:'<p style="text-align:center;">艾萨拉是</p> <p style="text-align:center;"><span style="color: rgb(41,105,176);">爱上了大苏打</span></p>'}}></div>
            </Fragment>
        )
    }
}
export default HtmlShow;