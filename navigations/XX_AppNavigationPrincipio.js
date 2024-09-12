import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { AddNewCard, BookEvent, BookEventDetails, Call, CancelBooking, CancelBookingPaymentMethods, ChangeEmail, ChangePIN, ChangePassword, Chat, CreateNewPIN, CreateNewPassword, CustomerService, EReceipt, EditProfile, EnterYourPIN, EventDetails, EventDetailsLocation, EventDetailsOrganizer, EventDetailsPeopleGoing, EventReviews, FeaturedEvents, FillYourProfile, Fingerprint, ForgotPasswordEmail, ForgotPasswordMethods, ForgotPasswordPhoneNumber, Gallery, HelpCenter, InviteFriends, MyBooking, Notifications, OTPVerification, Onboarding1, Onboarding2, Onboarding3, Onboarding4, PaymentMethods, PopularEvents, ReviewSummary, Search, SettingsLanguage, SettingsNotifications, SettingsPayment, SettingsPrivacyPolicy, SettingsSecurity, Signup, Welcome } from '../screens';
import BottomTabNavigation from './BottomTabNavigation';
import Personajes from '../screens/mios/Personajes';
import Series from '../screens/mios/Series';
import DetallesSeries from '../screens/mios/DetallesSeries';
import ComentariosSerie from '../screens/mios/ComentariosSerie';
import Galeria from '../screens/mios/Galeria';
import Login from '../screens/mios/Login';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkIfFirstLaunch = async () => {
            try {
                const value = await AsyncStorage.getItem('alreadyLaunched')
                if (value === null) {
                    await AsyncStorage.setItem('alreadyLaunched', 'true')
                    setIsFirstLaunch(true)
                } else {
                    setIsFirstLaunch(false)
                }
            } catch (error) {
                setIsFirstLaunch(false)
            }
            setIsLoading(false) // Set loading state to false once the check is complete
        }

        checkIfFirstLaunch()
    }, [])

    if (isLoading) {
        return null // Render a loader or any other loading state component
    }

  return (
    <NavigationContainer>
            <Stack.Navigator 
              screenOptions={{ headerShown: false }}
              // replace the second onboaring1 with login in order to make the user not to see the onboarding 
              // when login the next time
              initialRouteName={isFirstLaunch ? 'Onboarding1' : 'Signup'}>
                <Stack.Screen name="Onboarding1" component={Onboarding1}/>
                <Stack.Screen name="Onboarding2" component={Onboarding2}/>
                <Stack.Screen name="Onboarding3" component={Onboarding3}/>
                <Stack.Screen name="Onboarding4" component={Onboarding4}/>
                <Stack.Screen name="Welcome" component={Welcome}/>
                <Stack.Screen name="Login" component={Login}/>
                <Stack.Screen name="Signup" component={Signup}/>
                <Stack.Screen name="ForgotPasswordMethods" component={ForgotPasswordMethods}/>
                <Stack.Screen name="ForgotPasswordEmail" component={ForgotPasswordEmail}/>
                <Stack.Screen name="ForgotPasswordPhoneNumber" component={ForgotPasswordPhoneNumber}/>
                <Stack.Screen name="OTPVerification" component={OTPVerification}/>
                <Stack.Screen name="CreateNewPassword" component={CreateNewPassword}/>
                <Stack.Screen name="FillYourProfile" component={FillYourProfile}/>
                <Stack.Screen name="CreateNewPIN" component={CreateNewPIN}/>
                <Stack.Screen name="Fingerprint" component={Fingerprint}/>
                <Stack.Screen name="Main" component={BottomTabNavigation}/>
                <Stack.Screen name="EditProfile" component={EditProfile}/>
                <Stack.Screen name="SettingsNotifications" component={SettingsNotifications}/>
                <Stack.Screen name='SettingsPayment' component={SettingsPayment}/>
                <Stack.Screen name="AddNewCard" component={AddNewCard}/>
                <Stack.Screen name="SettingsSecurity" component={SettingsSecurity}/>
                <Stack.Screen name="ChangePIN" component={ChangePIN}/>
                <Stack.Screen name="ChangePassword" component={ChangePassword}/>
                <Stack.Screen name="ChangeEmail" component={ChangeEmail}/>
                <Stack.Screen name="SettingsLanguage" component={SettingsLanguage}/>
                <Stack.Screen name="SettingsPrivacyPolicy" component={SettingsPrivacyPolicy}/>
                <Stack.Screen name="InviteFriends" component={InviteFriends}/>
                <Stack.Screen name="HelpCenter" component={HelpCenter}/>
                <Stack.Screen name="CustomerService" component={CustomerService}/>
                <Stack.Screen name="EReceipt" component={EReceipt}/>
                <Stack.Screen name="Call" component={Call}/>
                <Stack.Screen name="Chat" component={Chat}/>
                <Stack.Screen name="Notifications" component={Notifications}/>
                <Stack.Screen name="Search" component={Search}/>
                <Stack.Screen name="Gallery" component={Gallery}/>
                <Stack.Screen name="PaymentMethods" component={PaymentMethods}/>
                <Stack.Screen name="ReviewSummary" component={ReviewSummary}/>
                <Stack.Screen name="MyBooking" component={MyBooking}/>
                <Stack.Screen name="CancelBooking" component={CancelBooking}/>
                <Stack.Screen name="CancelBookingPaymentMethods" component={CancelBookingPaymentMethods}/>
                <Stack.Screen name="FeaturedEvents" component={FeaturedEvents}/>
                <Stack.Screen name="PopularEvents" component={PopularEvents}/>
                <Stack.Screen name="EventDetails" component={EventDetails}/>
                <Stack.Screen name="EventReviews" component={EventReviews}/>
                <Stack.Screen name="EventDetailsOrganizer" component={EventDetailsOrganizer}/>
                <Stack.Screen name="EventDetailsLocation" component={EventDetailsLocation}/>
                <Stack.Screen name="EventDetailsPeopleGoing" component={EventDetailsPeopleGoing}/>
                <Stack.Screen name="BookEvent" component={BookEvent}/>
                <Stack.Screen name="BookEventDetails" component={BookEventDetails}/>
                <Stack.Screen name="EnterYourPIN" component={EnterYourPIN}/>

                {/* Victor */}
                <Stack.Screen name="Personajes" component={Personajes}/>
                <Stack.Screen name="Series" component={Series}/>
                <Stack.Screen name="DetallesSeries" component={DetallesSeries}/>
                <Stack.Screen name="ComentariosSerie" component={ComentariosSerie}/>
                <Stack.Screen name="Galeria" component={Galeria}/>

              </Stack.Navigator> 
     </NavigationContainer>
  )
}

export default AppNavigation