import * as chai from "chai";
import supertest from "supertest";



const expect = chai.expect
const requester = supertest("http://localhost:8083");

describe("testing del Proyecto", () => {
//     describe("test de products", () => {
//         it("testing de enpoint POST /products debe crear un producto correctamente", async () => {
//             const productMock = {
//                 title: "Botines grises",
//                 description: "botines con tacon grises",
//                 price: 2050,
//                 thumbnail: "https://inside-sho.com/354799/botines-con-tacon-y-hebilla.webp",
//                 code: 2344,
//                 stock: 23,
//                 status: true,
//                 category: "botas"
//             };

//       // Realiza la solicitud POST para crear un nuevo producto
//         const response = await requester.post("/api/products").send(productMock);

//       // Verifica que la respuesta tenga el código de estado 200 (OK)
//         expect(response.status).to.equal(200);

//       // Verifica que la respuesta tenga el cuerpo esperado
//         expect(response.body).to.have.property("success").to.be.true;
//         expect(response.body).to.have.property("message").to.equal("Producto creado exitosamente");
//         expect(response.body).to.have.property("product");

//       // Verifica que el producto creado tenga un identificador (_id)
//         expect(response.body.product).to.have.property("_id");

     
//         });
        
// //GET 
// it("testing de enpoint GET /products debe trar todos los productos correctamente", async () => {
//             const { body, ok, status } = await requester.get("/api/products"); // Ajusta la ruta de la solicitud
//             expect(ok).to.be.true;
//             expect(status).to.be.equal(200);
//             // Puedes agregar más aserciones según sea necesario sobre el cuerpo de la respuesta
//         });
//     });

//TESTING DE SESION 

describe("test avanzado Session", () => {
    let cookie;

    // it("Debe poder registrar un usuario correctamente", async () => {
    //     const userMock = {
    //         first_name: "Diana",
    //         last_name: "Sir",
    //         email: "sirD@gmail.com",
    //         password: "12345"
    //     };

    //     const response = await requester.post("/api/session/register").send(userMock);
    //     // Verifica que el código de estado sea 302
    // expect(response).to.have.status(302);

    // // Verifica la redirección a la página de inicio de sesión con un parámetro de éxito
    // expect(response).to.have.header('Location', '/login?success=true');
    // })



    // it("Debe poder loguear un usuario correctamente y devolver una cookie", async () => {
    //     const userMock = {
    //         email: "sirD@gmail.com",
    //         password: "12345"
    //     };

    //     const response = await requester.post("/api/session/login").send(userMock);

    //     expect(response.status).to.equal(302); // Espera un código de estado 302 para la redirección después del inicio de sesión
    //     // expect(response.headers["set-cookie"]).to.be.an("array");
    //     expect(response.header['set-cookie']).to.be.an('array').that.is.not.empty; // Verifica la existencia de la cookie
    // });

    
        // it('Debe enviar la cookie que contiene el usuario y destructurar este correctamente', async () => {
        //     // Define las credenciales de usuario para iniciar sesión
        //     const userCredentials = {
        //         email: 'sirD@gmail.com',
        //         password: '12345'
        //     };
    
        //     // Realiza el inicio de sesión enviando una solicitud POST a tu endpoint de inicio de sesión
        //     const loginResponse = await requester.post('/api/session/login').send(userCredentials);
    
        //     // Verifica si la cookie está presente en las cabeceras de la respuesta
        //     if (loginResponse.headers['set-cookie']) {
        //         // Extrae la cookie de las cabeceras de la respuesta
        //         const cookieResult = loginResponse.headers['set-cookie'][0];
        //         // Extrae el nombre y el valor de la cookie
        //         const cookieName = cookieResult.split('=')[0];
        //         const cookieValue = cookieResult.split('=')[1];
    
        //         // Realiza una solicitud que requiera la cookie, como obtener la información del usuario actual
        //         const userInfoResponse = await requester.get('/api/session/current').set('Cookie', [`${cookieName}=${cookieValue}`]);
    
        //         // Verifica el código de estado de la respuesta y la información del usuario
        //         expect(userInfoResponse.status).to.equal(200);
        //         expect(userInfoResponse.body.user.email).to.equal('sirD@gmail.com');

        //         // Asegúrate de ajustar 'user.email' con la propiedad correcta donde está almacenado el correo electrónico en tu objeto de usuario en la respuesta
        //     } else {
        //         // Si la cookie no está presente, lanza un error
        //         throw new Error('La cookie no está presente en la respuesta.');
        //     }
        // });

        
    });

describe('Pruebas  de carrito', () => {
       // Prueba para crear un carrito
       it('Debería crear un carrito cuando un usuario inicia sesión', async () => {
        // Simular el inicio de sesión para obtener un token de autenticación
        const loginResponse = await requester.post("/api/session/login").send({
            email: "sirD@gmail.com",
            password: "12345"
        });

        // Verificar que el inicio de sesión fue exitoso (código de estado 200)
        expect(loginResponse.status).to.equal(200);

        // Extraer el token de autenticación de la respuesta
        const authToken = loginResponse.body.token;

        // Realizar la solicitud para crear un carrito utilizando el token de autenticación
        const response = await requester.post("/api/carts").set("Authorization", `Bearer ${authToken}`);

        // Verificar que se crea el carrito correctamente (código de estado 200 y presencia de cartID en la respuesta)
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('cartID');
    });
        // // Prueba para el controlador addProductToCart
        // it('Debería agregar un producto al carrito correctamente', async () => {
        //   const productId = '65ab0bf9ae9d14885911b353'; // ID del producto que deseas agregar al carrito
      
        //   const response = await requester.post(`/api/cart/add/${productId}`).set('Authorization', 'Bearer tu_token_de_autenticacion'); // Asegúrate de incluir un token de autenticación válido
      
        //   expect(response.status).to.equal(302); // Espera un código de estado 302 (redirección)
        //   expect(response.header).to.have.property('location'); // Espera que la respuesta tenga una cabecera 'location' que indique la URL del carrito
        // });
      });
});