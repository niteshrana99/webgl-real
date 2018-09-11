/*
Object oriented Programing:
Objects interact with each other through methods and properties.

We can create instance of object by using contructor or prototype. So based on the constructor we can create as many as instances.
So constructor acts as a blue-print to create object.

Inheritance:One object is based on other object. So one object has access to other objects values.
Inheritance is made possible through the prototype property that every JS object has. Suppose we have a person object(Contsructor)
and a John object is one of the instance.
If we want John to inherit a property or method, we have to add that method to person's prototype property.
Note: Our person object is itself inherited from Object in JS, whose proptotype contains properties such as hasOwnProperty etc. This
is called prototype chain.
Prototype chain:
When we try to access a certain method or property on object, JS will try to find that on the object. But if not found, it
will look into prototype which is the prototype of parent. If it does not find it there it will keep looking until null.
null has no prototype and is the final peice of the chain.
The constructor's prototype property is not the prototype of contructor itself , it's the prototype of All the instances created
through it.
``
*/

/* Creating object using function contructor:*/
/*When we use a new keyword a brand new empty object is created and this variable of function points to empty object created by new
operator;*/

var Person = function(name, yob, job) {
  this.name = name;
  this.yob = yob;
  this.job = job;
}

Person.prototype.calcAge = function() {
  console.log(2018 - this.yob);
}

var john = new Person('john', 1992, 'teacher');
var jane = new Person('Jane', 1995, 'Writer');
john.calcAge();
jane.calcAge();
console.log(john);

//object.create
// A diffrent way of creating a prototype. this function take two values, first is prototype object and 2nd being the objects
//containg values.

var personProto = {
  calcAge: function() {
    console.log(2018-this.yob)
  }
};

var john = Object.create(personProto, {}); //personProto specifies the prototype this object will have and {} specifies the
//private proprties of object;
console.log(john);

var jane = Object.create(personProto, {
  name: {value:'jane'},
  yob: {value: 1991}
});

jane.calcAge();

//The difference between Object.create and function constructor.
/*
Object.create builds an object that inherits directly from the object passed as first argument,\\
Function constructor , te newly cretaed object inherits from prototype property.
*/

/*Primitives vs Objects*/
/*
Primitives hold their own copy of data. They don't refrence anything,
Objects: Create a new refrence that points to exact same object in memory.
*/

//Primitives:
var a = 21;
var b = a; //they do not refrence a and a seperate copy is created.
a = 28;
console.log(a);
console.log(b);

//Objects:
var aObj = {
  age:21
};
var bObj = aObj; //It creates a refrence that points to same memory location.
aObj.age = 34;
console.log(bObj.age);

//functions:
var age = 21;
var obj = {
  age:21,
  city:'Bglr'
}
function change(a,b) {
  a = 20;
  b.city = 'Hmr'
};

change(age,obj);
console.log(age); // Does not change as a copy is created in function.
console.log(obj); //Points to same memory as it is refrenced hence changes.



/*
Functions:
A function behaves as object in JS.
-- A function is an instance of object type;
-- A function behaves like any other object,
-- We can store function to a variable;
-- We can pass function as argument;
-- we can return functions.
These are called first class functions.
*/

/*
Passing function as arguments:

*/
var years = [1994, 1996, 1998, 2000, 2002];
function ageCalc(arr, fn) {
  var ageArr = [];
  for(var i=0;i<arr.length;i++) {
    ageArr.push(fn(arr[i]))
  };
  return ageArr;
}

var ages = ageCalc(years, function(el) {
  return 2018 - el;
});

console.log(ages);

/*
functions returning functions:
*/
function interViewQuestions(job) {
  if(job === 'designer') {
    return function(name) {
      console.log(name + ', can u explain about UX?')
    }
  } else if(job === 'teacher') {
    return function(name) {
      console.log(name + ', What do u teach')
    }
  } else {
    return function(name) {
      console.log(name + ', What do u do?')
    }
  }
}

var teacherQuestion = interViewQuestions('teacher');
teacherQuestion('john');

/*
IIFE:
IIFE's are used to create data privacy. If we want a function variable to be unacceible from outside we can use IIFE's.
All we want from IIFE is a new scope that is hidden from outside scope. So we dont interefere with global execution context.
*/

(function() {
    var score = Math.random() * 10;
    console.log(score > 5);
})();
