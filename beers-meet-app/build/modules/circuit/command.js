const CommandsFactory = require('hystrixjs').commandFactory;
const command = (request, serviceName) =>
  CommandsFactory.getOrCreate(serviceName)
  .circuitBreakerErrorThresholdPercentage(50) //porcentaje para que el circuito se abra y deje de mandar requests
  .timeout(10000) //timeout
  .run(request) //el metodo que esta wrapeando este comando, o sea aca va la llamada al forecast. Tiene que retornar una promesa.
  .circuitBreakerRequestVolumeThreshold(20) //minima cantidad de request que tiene que ser superado para que la dependencia calcule el health
  .circuitBreakerSleepWindowInMilliseconds(5000) // 5 segundos. -> cuanto tiempo el circuito tiene que estar abierto antes de lanzar el primer request para probar que el servicio exterior se haya levantado
  .statisticalWindowLength(10000)
  .statisticalWindowNumberOfBuckets(10)
  .errorHandler((error) => console.log(error))
  .build();

module.exports = command;
