EX1:
Asynchronous code: Code is not stopped and will run the other functionality.
--Move on immediately ! No blocking.
-- Callback as soon as it is finished doing it's work.

Synchronous code: Line by line. One instaruction after another

Behind the scenes:
first function is called and execution context is put on execution stack. Now second function is called and other function EC is created. Now setTimeout will create another execution context.
Now setTimeout is part of webApi's which are outside the JS engine. So DOM events , XMLHTTP request all live outside JS engine. So this is where timer will keep running for 2s. So when we call setTimeout timer is created inside web API environment.  So the call back function is not called and stays attached to timer until it fineshes. So setTimeout function pops out od stack, so as the second function and then first function pops out of EC or call stack.
Now our 2 seconds pass and the timer disappears and the callback function goes to "message queue" and it waits to be executed until the stack is empty.
So the job of event loop is to monitor the excution stack and message queue and to push the first callback function inline on the stack as soon as the stack is empty.

EX2:
Is callback hell. Callback inside one and other. With promises we can avoid callback hell.

EX3:
promises:A promise is a object that keeps tracks whether a certain event happened or not.
It also determines what happen next once the event(async) has happened. So promise implements a kind of future value that we are expecting.
Promise states:
--Pending
--Event happens
--Resolved
  --fulfilled
  --rejected
We can produce and consume promise.
When we produce a promise we create a new promise and send the result using the promise. When we consume it we can use callback functions for fulfillement and rejection.

We create promise by using new keyword as promise is a object. In this function we pass first parameter called executor function which is the executed as soon as promise is created. This executor fxn takes take two callback fxns. which are resolve and reject.
All of the promises have then and catch method.
