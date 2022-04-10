import { RequestMapping } from "@/annotation";

@RequestMapping('/hello')
class Hello {  
  @RequestMapping('/sayHiAgain')
  index(ctx) {
    ctx.body = 'hello';
  }
}

export default Hello;