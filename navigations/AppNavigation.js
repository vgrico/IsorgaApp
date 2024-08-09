import React, { useState, useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import BottomTabNavigation from './BottomTabNavigation'

import Login from '../screens/General/Login'
import Perfil from '../screens/General/Perfil'
import Centros from '../screens/General/Centros'

import ControlDocumental from '../screens/ControlDocumental/ControlDocumental'
import ManualDocumentos from '../screens/ControlDocumental/ManualDocumentos'
import Procedimientos from '../screens/ControlDocumental/Procedimientos'
import Instrucciones from '../screens/ControlDocumental/Instrucciones'
import Procesos from '../screens/ControlDocumental/Procesos'
import Formatos from '../screens/ControlDocumental/Formatos'
import Pendientes from '../screens/ControlDocumental/Pendientes'
import Documento from '../screens/ControlDocumental/Documento'

import NoConformidades from '../screens/NoConformidades/NoConformidades'

import Quimicos from '../screens/Quimicos/Quimicos'
import Fds from '../screens/Quimicos/Fds'

import ListadoBox from '../screens/Box/ListadoBox'
import DocumentoBox from '../screens/Box/DocumentoBox'

import RecursosHumanos from '../screens/RecursosHumanos/RecursosHumanos'
import PersonalFicha from '../screens/RecursosHumanos/PersonalFicha'
import PersonalGeneral from '../screens/RecursosHumanos/PersonalGeneral'
import PersonalFormaciones from '../screens/RecursosHumanos/PersonalFormaciones'
import PersonalPuestos from '../screens/RecursosHumanos/PersonalPuestos'
import DocumentosPuesto from '../screens/RecursosHumanos/DocumentosPuesto'

import InformeNuevo from '../screens/Informes/InformeNuevo'

import Equipos from '../screens/Equipos/Equipos'
import ListaEquipos from '../screens/Equipos/ListaEquipos'

const Stack = createNativeStackNavigator()

const AppNavigation = () => {
    const [isFirstLaunch, setIsFirstLaunch] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkUserId = async () => {
            try {
                const userId = await AsyncStorage.getItem('isorgaId')
                if (userId !== null) {
                    setIsFirstLaunch(false) // Si existe el ID en AsyncStorage, no es el primer lanzamiento
                } else {
                    setIsFirstLaunch(true) // Si no existe el ID en AsyncStorage, es el primer lanzamiento
                }
            } catch (error) {
                console.error('Error checking user ID:', error)
            } finally {
                setIsLoading(false) // Finaliza la carga
            }
        }

        checkUserId()
    }, [])

    if (isLoading) {
        return null // Renderiza un loader o cualquier otro componente de estado de carga
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{ headerShown: false }}
                initialRouteName={isFirstLaunch ? 'Login' : 'Main'}
            >

                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Main" component={BottomTabNavigation} />
                
                <Stack.Screen name="Perfil" component={Perfil} />
                <Stack.Screen name="Centros" component={Centros} />
                <Stack.Screen
                    name="ControlDocumental"
                    component={ControlDocumental}
                />
                <Stack.Screen
                    name="Quimicos"
                    component={Quimicos}
                />
                <Stack.Screen
                    name="NoConformidades"
                    component={NoConformidades}
                />
                <Stack.Screen
                    name="Manual&Documentos"
                    component={ManualDocumentos}
                />
                <Stack.Screen
                    name="Procedimientos"
                    component={Procedimientos}
                />
                <Stack.Screen name="Documento" component={Documento} />
                <Stack.Screen name="Fds" component={Fds} />
                <Stack.Screen name="Procesos" component={Procesos} />
                <Stack.Screen name="Instrucciones" component={Instrucciones} />
                <Stack.Screen name="Formatos" component={Formatos} />
                <Stack.Screen name="Pendientes" component={Pendientes} />

                <Stack.Screen name="ListadoBox" component={ListadoBox} />
                <Stack.Screen name="DocumentoBox" component={DocumentoBox} />

                <Stack.Screen name="RecursosHumanos" component={RecursosHumanos} />

                <Stack.Screen name="PersonalFicha" component={PersonalFicha} />
                <Stack.Screen name="PersonalGeneral" component={PersonalGeneral} />
                <Stack.Screen name="PersonalFormaciones" component={PersonalFormaciones} />
                <Stack.Screen name="PersonalPuestos" component={PersonalPuestos} />
                <Stack.Screen name="DocumentosPuesto" component={DocumentosPuesto} />
                
                <Stack.Screen name="InformeNuevo" component={InformeNuevo} />

                <Stack.Screen name="Equipos" component={Equipos} />
                <Stack.Screen name="ListaEquipos" component={ListaEquipos} />



            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigation









    {/* <Stack.Screen name="Onboarding1" component={Onboarding1} />
        <Stack.Screen name="ForgotPasswordMethods" component={ForgotPasswordMethods} />
        <Stack.Screen name="OTPVerification" component={OTPVerification} />
        <Stack.Screen name="CreateNewPassword" component={CreateNewPassword} />
        <Stack.Screen name="FillYourProfile" component={FillYourProfile} />
        <Stack.Screen name="CreateNewPIN" component={CreateNewPIN} />
        <Stack.Screen name="Fingerprint" component={Fingerprint} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="SettingsNotifications" component={SettingsNotifications} />
        <Stack.Screen name="SettingsPayment" component={SettingsPayment} />
        <Stack.Screen name="AddNewCard" component={AddNewCard} />
        <Stack.Screen name="SettingsSecurity" component={SettingsSecurity} />
        <Stack.Screen name="ChangePIN" component={ChangePIN} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="ChangeEmail" component={ChangeEmail} />
        <Stack.Screen name="SettingsLanguage" component={SettingsLanguage} />
        <Stack.Screen name="SettingsPrivacyPolicy" component={SettingsPrivacyPolicy} />
        <Stack.Screen name="InviteFriends" component={InviteFriends} />
        <Stack.Screen name="HelpCenter" component={HelpCenter} />
        <Stack.Screen name="CustomerService" component={CustomerService} />
        <Stack.Screen name="EReceipt" component={EReceipt} />
        <Stack.Screen name="Call" component={Call} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Gallery" component={Gallery} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
        <Stack.Screen name="ReviewSummary" component={ReviewSummary} />
        <Stack.Screen name="MyBooking" component={MyBooking} />
        <Stack.Screen name="CancelBooking" component={CancelBooking} />
        <Stack.Screen name="CancelBookingPaymentMethods" component={CancelBookingPaymentMethods} />
        <Stack.Screen name="FeaturedEvents" component={FeaturedEvents} />
        <Stack.Screen name="PopularEvents" component={PopularEvents} />
        <Stack.Screen name="EventDetails" component={EventDetails} />
        <Stack.Screen name="EventReviews" component={EventReviews} />
        <Stack.Screen name="EventDetailsOrganizer" component={EventDetailsOrganizer} />
        <Stack.Screen name="EventDetailsLocation" component={EventDetailsLocation} />
        <Stack.Screen name="EventDetailsPeopleGoing" component={EventDetailsPeopleGoing} />
        <Stack.Screen name="BookEvent" component={BookEvent} />
        <Stack.Screen name="BookEventDetails" component={BookEventDetails} />
        <Stack.Screen name="SeleccionarSerie" component={SeleccionarSerie} />
        <Stack.Screen name="EditarPerfil" component={EditarPerfil} />
        <Stack.Screen name="ExPregunta1" component={ExPregunta1} />
        <Stack.Screen name="ExPregunta2" component={ExPregunta2} />
        <Stack.Screen name="ExPregunta3" component={ExPregunta3} />
        <Stack.Screen name="ExPregunta4" component={ExPregunta4} />
        <Stack.Screen name="ExPregunta5" component={ExPregunta5} />
        <Stack.Screen name="MisSeriesExamen" component={MisSeriesExamen} />
        <Stack.Screen name="Sobres" component={Sobres} />
        <Stack.Screen name="JuegoPixels1" component={JuegoPixels1} />
        <Stack.Screen name="JuegoPixels2" component={JuegoPixels2} />
        <Stack.Screen name="JuegoPixels3" component={JuegoPixels3} />
        <Stack.Screen name="JuegoPixels4" component={JuegoPixels4} />
        <Stack.Screen name="JuegoPixels5" component={JuegoPixels5} />
        <Stack.Screen name="CartasFavoritas" component={CartasFavoritas} />
        <Stack.Screen name="JuegoSemanal1" component={JuegoSemanal1} />
        <Stack.Screen name="JuegoSemanal2" component={JuegoSemanal2} />
        <Stack.Screen name="JuegoSemanal3" component={JuegoSemanal3} />
        <Stack.Screen name="JuegoSemanal4" component={JuegoSemanal4} />
        <Stack.Screen name="JuegoSemanal5" component={JuegoSemanal5} />
        <Stack.Screen name="JuegoSemanal6" component={JuegoSemanal6} />
        <Stack.Screen name="SeleccionarTipoPublicacion" component={SeleccionarTipoPublicacion} />
        <Stack.Screen name="SubirPublicacionCarta" component={SubirPublicacionCarta} />
        <Stack.Screen name="SubirPublicacionSerie" component={SubirPublicacionSerie} />
        <Stack.Screen name="JuegoMundialDeCartas" component={JuegoMundialDeCartas} />
        <Stack.Screen name="JuegoCartasPartida" component={JuegoCartasPartida} />
        <Stack.Screen name="ResumenCartas" component={ResumenCartas} />
        <Stack.Screen name="CartasOrdenadas" component={CartasOrdenadas} />
        <Stack.Screen name="ClasificacionMundial" component={ClasificacionMundial} />
        <Stack.Screen name="Quiz" component={Quiz} />
        <Stack.Screen name="ClasificacionQuiz" component={ClasificacionQuiz} />
        <Stack.Screen name="EstadisticasMundial" component={EstadisticasMundial} />
        <Stack.Screen name="ResultadosSemana" component={ResultadosSemana} />
        <Stack.Screen name="ListadoUsuarios" component={ListadoUsuarios} />
        <Stack.Screen name="ClasificacionQuePersonajePrefieres" component={ClasificacionQuePersonajePrefieres} />
        <Stack.Screen name="Series" component={Series} />
        <Stack.Screen name="DetallesSeries" component={DetallesSeries} />
        <Stack.Screen name="Personajes" component={Personajes} />
        <Stack.Screen name="ComentariosSerie" component={ComentariosSerie} />
        <Stack.Screen name="Pregunta1" component={Pregunta1} />
        <Stack.Screen name="Pregunta2" component={Pregunta2} />
        <Stack.Screen name="Pregunta3" component={Pregunta3} />
        <Stack.Screen name="Pregunta4" component={Pregunta4} />
        <Stack.Screen name="Pregunta5" component={Pregunta5} />
        <Stack.Screen name="Loguearse" component={Loguearse} />
        <Stack.Screen name="QuePrefieresPersonajes" component={QuePrefieresPersonajes} />
        <Stack.Screen name="QuePrefieresSeries" component={QuePrefieresSeries} />
        <Stack.Screen name="RankingQuePersonajePrefieres" component={RankingQuePersonajePrefieres} />
        <Stack.Screen name="RankingQueSeriePrefieres" component={RankingQueSeriePrefieres} />
        <Stack.Screen name="Juegos" component={Juegos} />
        <Stack.Screen name="JuegosQuePrefieres" component={JuegosQuePrefieres} />
        <Stack.Screen name="JuegoPreguntas" component={JuegoPreguntas} />
        <Stack.Screen name="CanviarPersonaje" component={CanviarPersonaje} />
        <Stack.Screen name="Galeria" component={Galeria} />
        <Stack.Screen name="InicioDatos" component={InicioDatos} />
        <Stack.Screen name="CrearPublicacion" component={CrearPublicacion} />
        <Stack.Screen name="Publicaciones" component={Publicaciones} />
        <Stack.Screen name="Notificaciones" component={Notificaciones} />
        <Stack.Screen name="CambiarTitulo" component={CambiarTitulo} />
        <Stack.Screen name="PerfilUsuario" component={PerfilUsuario} />
        <Stack.Screen name="EnterYourPIN" component={EnterYourPIN} />

         */}


         // import Personajes from '../screens/mios/Personajes';
// import Series from '../screens/mios/Series';
// import DetallesSeries from '../screens/mios/DetallesSeries';
// import ComentariosSerie from '../screens/mios/ComentariosSerie';
// import Galeria from '../screens/mios/Galeria';
// import Pregunta1 from '../screens/mios/preguntas/Pregunta1';
// import Pregunta2 from '../screens/mios/preguntas/Pregunta2';
// import Pregunta3 from '../screens/mios/preguntas/Pregunta3';
// import Pregunta4 from '../screens/mios/preguntas/Pregunta4';
// import Pregunta5 from '../screens/mios/preguntas/Pregunta5';
// import Loguearse from '../screens/mios/Loguearse';
// import QuePrefieres from '../screens/mios/QuePrefieresPersonajes';
// import JuegosQuePrefieres from '../screens/mios/JuegosQuePrefieres';
// import QuePrefieresPersonajes from '../screens/mios/QuePrefieresPersonajes';
// import QuePrefieresSeries from '../screens/mios/QuePrefieresSeries';
// import RankingQuePersonajePrefieres from '../screens/mios/RankingQuePersonajePrefieres';
// import RankingQueSeriePrefieres from '../screens/mios/RankingQueSeriePrefieres';
// import JuegoPreguntas from '../screens/mios/JuegoPreguntas';
// import CanviarPersonaje from '../screens/mios/preguntas/CanviarPersonaje';
// import PerfilUsuario from '../screens/mios/PerfilUsuario';
// import CrearPublicacion from '../screens/mios/SubirPublicaciones';
// import SeleccionarSerie from '../screens/mios/SeleccionarSerie';
// import InicioDatos from '../screens/mios/InicioDatos';
// import Notificaciones from '../screens/mios/Notificaciones';
// import CambiarTitulo from '../screens/mios/CambiarTitulo';
// import EditarPerfil from '../screens/mios/EditarPerfil';
// import ExPregunta1 from '../screens/mios/examen/Pregunta1';
// import ExPregunta2 from '../screens/mios/examen/Pregunta2';
// import ExPregunta3 from '../screens/mios/examen/Pregunta3';
// import ExPregunta4 from '../screens/mios/examen/Pregunta4';
// import ExPregunta5 from '../screens/mios/examen/Pregunta5';
// import MisSeriesExamen from '../screens/mios/MisSeriesExamen';
// import Sobres from '../screens/mios/Sobres';
// import JuegoPixels2 from '../screens/mios/juegoPixels/JuegosPixels2';
// import JuegoPixels1 from '../screens/mios/juegoPixels/JuegosPixels1';
// import JuegoPixels3 from '../screens/mios/juegoPixels/JuegosPixels3';
// import JuegoPixels4 from '../screens/mios/juegoPixels/JuegosPixels4';
// import JuegoPixels5 from '../screens/mios/juegoPixels/JuegosPixels5';
// import CartasFavoritas from '../screens/mios/CartasFavoritas';
// import JuegoSemanal1 from '../screens/mios/juegoSemanal/Pregunta1';
// import JuegoSemanal2 from '../screens/mios/juegoSemanal/Pregunta2';
// import JuegoSemanal3 from '../screens/mios/juegoSemanal/Pregunta3';
// import JuegoSemanal4 from '../screens/mios/juegoSemanal/Pregunta4';
// import JuegoSemanal5 from '../screens/mios/juegoSemanal/Pregunta5';
// import JuegoSemanal6 from '../screens/mios/juegoSemanal/Pregunta6';
// import SeleccionarTipoPublicacion from '../screens/mios/SeleccionarTipoPublicacion';
// import SubirPublicacionCarta from '../screens/mios/SubirPublicacionCartas';
// import SubirPublicacionSerie from '../screens/mios/SubirPublicacionSerie';
// import JuegoMundialDeCartas from '../screens/mios/JuegoMundialCartas';
// import JuegoCartasPartida from '../screens/mios/JuegoCartasPartida';
// import ResumenCartas from '../screens/mios/ResumenCartas';
// import CartasOrdenadas from '../screens/mios/CartasOrdenadas';
// import ClasificacionMundial from '../screens/mios/ClasificacionMundial';
// import Quiz from '../screens/mios/Quiz';
// import ClasificacionQuiz from '../screens/mios/ClasificacionQuiz';
// import EstadisticasMundial from '../screens/mios/EstadisticasMundial';
// import ResultadosSemana from '../screens/mios/ResultadosSemana';
// import ListadoUsuarios from '../screens/mios/ListadoUsuarios';
// import ClasificacionQuePersonajePrefieres from '../screens/mios/ClasificacionQuePersonajePrefieres';

// import {
//   Signup,
//     Onboarding1,
//     ForgotPasswordMethods,
//     OTPVerification,
//     CreateNewPassword,
//     FillYourProfile,
//     CreateNewPIN,
//     Fingerprint,
//     EditProfile,
//     SettingsNotifications,
//     SettingsPayment,
//     AddNewCard,
//     SettingsSecurity,
//     ChangePIN,
//     ChangePassword,
//     ChangeEmail,
//     SettingsLanguage,
//     SettingsPrivacyPolicy,
//     InviteFriends,
//     HelpCenter,
//     CustomerService,
//     EReceipt,
//     Call,
//     Chat,
//     Notifications,
//     Search,
//     Gallery,
//     PaymentMethods,
//     ReviewSummary,
//     MyBooking,
//     CancelBooking,
//     CancelBookingPaymentMethods,
//     FeaturedEvents,
//     PopularEvents,
//     EventDetails,
//     EventReviews,
//     EventDetailsOrganizer,
//     EventDetailsLocation,
//     EventDetailsPeopleGoing,
//     BookEvent,
//     BookEventDetails,
//     EnterYourPIN,
// } from '../screens'