import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Main, Onboarding1, Signup, ForgotPasswordMethods, OTPVerification, CreateNewPassword, FillYourProfile, CreateNewPIN, Fingerprint, EditProfile, SettingsNotifications, SettingsPayment, AddNewCard, SettingsSecurity, ChangePIN, ChangePassword, ChangeEmail, SettingsLanguage, SettingsPrivacyPolicy, InviteFriends, HelpCenter, CustomerService, EReceipt, Call, Chat, Notifications, Search, Gallery, PaymentMethods, ReviewSummary, MyBooking, CancelBooking, CancelBookingPaymentMethods, FeaturedEvents, PopularEvents, EventDetails, EventReviews, EventDetailsOrganizer, EventDetailsLocation, EventDetailsPeopleGoing, BookEvent, BookEventDetails, EnterYourPIN } from '../screens';
import BottomTabNavigation from './BottomTabNavigation';
import Personajes from '../screens/mios/Personajes';
import Series from '../screens/mios/Series';
import DetallesSeries from '../screens/mios/DetallesSeries';
import ComentariosSerie from '../screens/mios/ComentariosSerie';
import Galeria from '../screens/mios/Galeria';
import Login from '../screens/mios/Login';
import Pregunta1 from '../screens/mios/preguntas/Pregunta1';
import Pregunta2 from '../screens/mios/preguntas/Pregunta2';
import Pregunta3 from '../screens/mios/preguntas/Pregunta3';
import Pregunta4 from '../screens/mios/preguntas/Pregunta4';
import Pregunta5 from '../screens/mios/preguntas/Pregunta5';
import Loguearse from '../screens/mios/Loguearse';
import QuePrefieres from '../screens/mios/QuePrefieresPersonajes';
import RankingQuePrefieres from '../screens/mios/RankingQuePersonajePrefieres';
import Juegos from '../screens/mios/Juegos';
import JuegosQuePrefieres from '../screens/mios/JuegosQuePrefieres';
import QuePrefieresPersonajes from '../screens/mios/QuePrefieresPersonajes';
import QuePrefieresSeries from '../screens/mios/QuePrefieresSeries';
import RankingQuePersonajePrefieres from '../screens/mios/RankingQuePersonajePrefieres';
import RankingQueSeriePrefieres from '../screens/mios/RankingQueSeriePrefieres';
import JuegoPreguntas from '../screens/mios/JuegoPreguntas';
import CanviarPersonaje from '../screens/mios/preguntas/CanviarPersonaje';
import PerfilUsuario from '../screens/mios/PerfilUsuario';
import CrearPublicacion from '../screens/mios/SubirPublicaciones';
import Publicaciones from '../screens/mios/Publicaciones';
import Perfil from '../screens/mios/Perfil';
import SeleccionarSerie from '../screens/mios/SeleccionarSerie';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId !== null) {
          setIsFirstLaunch(false); // Si existe el ID en AsyncStorage, no es el primer lanzamiento
        } else {
          setIsFirstLaunch(true); // Si no existe el ID en AsyncStorage, es el primer lanzamiento
        }
      } catch (error) {
        console.error('Error checking user ID:', error);
      } finally {
        setIsLoading(false); // Finaliza la carga
      }
    };

    checkUserId();
  }, []);

  if (isLoading) {
    return null; // Renderiza un loader o cualquier otro componente de estado de carga
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={isFirstLaunch ? 'Login' : 'Main'}>
        <Stack.Screen name="Onboarding1" component={Onboarding1} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ForgotPasswordMethods" component={ForgotPasswordMethods} />
        <Stack.Screen name="OTPVerification" component={OTPVerification} />
        <Stack.Screen name="CreateNewPassword" component={CreateNewPassword} />
        <Stack.Screen name="FillYourProfile" component={FillYourProfile} />
        <Stack.Screen name="CreateNewPIN" component={CreateNewPIN} />
        <Stack.Screen name="Fingerprint" component={Fingerprint} />
        <Stack.Screen name="Main" component={BottomTabNavigation} />
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
        <Stack.Screen name="EnterYourPIN" component={EnterYourPIN} />


        {/* MIOS */}
        <Stack.Screen name="Personajes" component={Personajes} />
        <Stack.Screen name="Series" component={Series} />
        <Stack.Screen name="DetallesSeries" component={DetallesSeries} />
        <Stack.Screen name="ComentariosSerie" component={ComentariosSerie} />
        <Stack.Screen name="Galeria" component={Galeria} />
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
        <Stack.Screen name="PerfilUsuario" component={PerfilUsuario} />
        <Stack.Screen name="CrearPublicacion" component={CrearPublicacion} />
        {/* <Stack.Screen name="Publicaciones" component={Publicaciones} /> */}
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="SeleccionarSerie" component={SeleccionarSerie} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
