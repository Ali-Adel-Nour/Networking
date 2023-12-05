const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

const packageDef = protoLoader.loadSync("todo.proto",{})

const grpcObject = grpc.loadPackageDefinition(packageDef)

const todoPackage = grpcObject.todoPackage;

const sever=  new grpc.Server()

server.bind("0.0.0.0:4000",grpc.ServerCredentials.createInsecure())

server.addService(todoPackage.Todo.service,{

  "createTodo":createTodo,
  "readTodos":readTodos

})

server.start()

function createTodo(call,callback){
  console.log(call)
}

function readTodos(call,callback){


}