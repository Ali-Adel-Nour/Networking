const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

const packageDef = protoLoader.loadSync("todo.proto",{})

const grpcObject = grpc.loadPackageDefinition(packageDef)

const todoPackage = grpcObject.todoPackage;


const client =  new todoPackage.Todo("localhost:4000",grpc.credentialsInsecure())