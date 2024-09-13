import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BottomTabNavigation from "./BottomTabNavigation";

import Login from "../screens/General/Login";
import Perfil from "../screens/General/Perfil";
import Centros from "../screens/General/Centros";

import ListadoBox from "../screens/Box/ListadoBox";
import DocumentoBox from "../screens/Box/DocumentoBox";


import ControlDocumental from "../screens/ControlDocumental/ControlDocumental";
import ManualDocumentos from "../screens/ControlDocumental/ManualDocumentos";
import Procedimientos from "../screens/ControlDocumental/Procedimientos";
import Instrucciones from "../screens/ControlDocumental/Instrucciones";
import Procesos from "../screens/ControlDocumental/Procesos";
import Formatos from "../screens/ControlDocumental/Formatos";
import Pendientes from "../screens/ControlDocumental/Pendientes";
import Documento from "../screens/ControlDocumental/Documento";


import Quimicos from "../screens/Quimicos/Quimicos";
import Fds from "../screens/Quimicos/Fds";
import GestionQuimicos from "../screens/Quimicos/GestionQuimicos";
import DocumentosPQ from "../screens/Quimicos/DocumentosPQ";
import FormacionesPQ from "../screens/Quimicos/FormacionesPQ";
import DocumentoPQ from "../screens/Quimicos/DocumentoPQ";
import FormacionPQ from "../screens/Quimicos/FormacionPQ";


import RecursosHumanos from "../screens/RecursosHumanos/RecursosHumanos";
import PersonalFicha from "../screens/RecursosHumanos/PersonalFicha";
import PersonalGeneral from "../screens/RecursosHumanos/PersonalGeneral";
import PersonalFormaciones from "../screens/RecursosHumanos/PersonalFormaciones";
import PersonalPuestos from "../screens/RecursosHumanos/PersonalPuestos";
import DocumentosPuesto from "../screens/RecursosHumanos/DocumentosPuesto";
import PersonalSecciones from "../screens/RecursosHumanos/PersonalSecciones";
import PersonalPuestosSeccion from "../screens/RecursosHumanos/PersonalPuestosSeccion";
import PersonalLista from "../screens/RecursosHumanos/PersonalLista";


import InformeNuevo from "../screens/Informes/InformeNuevo";
import GestionInformes from "../screens/Informes/GestionInformes";
import InformesLista from "../screens/Informes/InformesLista";
import InformeStandard from "../screens/Informes/InformeStandard";
import InformeAH from "../screens/Informes/InformeAH";
import Informe5s from "../screens/Informes/Informe5s";


import Equipos from "../screens/Equipos/Equipos";
import ListaEquipos from "../screens/Equipos/ListaEquipos";
import DatosEquipo from "../screens/Equipos/DatosEquipo";
import GeneralEquipos from "../screens/Equipos/GeneralEquipos";
import PlanificacionesEquipos from "../screens/Equipos/PlanificacionesEquipos";
import RevisionesEquipo from "../screens/Equipos/RevisionesEquipo";


import GestionResiduos from "../screens/Residuos/GestionResiduos";
import MisGestiones from "../screens/Residuos/MisGestiones";
import MisRetiradas from "../screens/Residuos/MisRetiradas";
import MisResiduos from "../screens/Residuos/MisResiduos";
import NuevaRetirada from "../screens/Residuos/NuevaRetirada";


import NoConformidades from "../screens/NoConformidades/NoConformidades";
import ListadoNC from "../screens/NoConformidades/ListadoTotalNC";
import ListadoAbiertas from "../screens/NoConformidades/ListadoAbiertas";
import ListadoPendientes from "../screens/NoConformidades/ListadoPendientes";
import NoConformidad from "../screens/NoConformidades/NoConformidad";
import Correctivas from "../screens/NoConformidades/Correctivas";


import RequisitosLegales from "../screens/Requisitos/RequisitosLegales";
import MedioAmbiente from "../screens/Requisitos/MedioAmbiente";
import SegIndustrial from "../screens/Requisitos/SegIndustrial";
import SegLaboral from "../screens/Requisitos/SegLaboral";
import ListaRequisitos from "../screens/Requisitos/ListaRequisitos";
import FichaRequisito from "../screens/Requisitos/FichaRequisito";
import PendientesLeer from "../screens/Requisitos/PendientesLeer";
import CalendarioEquipos from "../screens/Equipos/CalendarioEquipos";
import CambiarCentros from "../screens/General/CambiarCentros";
import Auditorias from "../screens/Auditorias/Auditorias";
import Auditoria from "../screens/Auditorias/Auditoria";
import NuevaRuta from "../screens/Auditorias/NuevaRuta";
import Informe5sRespondido from "../screens/Informes/Informe5sRespondido";



const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem("isorgaId");
        if (userId !== null) {
          setIsFirstLaunch(false); // Si existe el ID en AsyncStorage, no es el primer lanzamiento
        } else {
          setIsFirstLaunch(true); // Si no existe el ID en AsyncStorage, es el primer lanzamiento
        }
      } catch (error) {
        console.error("Error checking user ID:", error);
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
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={isFirstLaunch ? "Login" : "Main"}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Main" component={BottomTabNavigation} />

        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="Centros" component={Centros} />
        <Stack.Screen name="CambiarCentros" component={CambiarCentros} />


        <Stack.Screen name="ListadoBox" component={ListadoBox} />
        <Stack.Screen name="DocumentoBox" component={DocumentoBox} />


        <Stack.Screen name="ControlDocumental" component={ControlDocumental} />
        <Stack.Screen name="Manual&Documentos" component={ManualDocumentos} />
        <Stack.Screen name="Procedimientos" component={Procedimientos} />
        <Stack.Screen name="Documento" component={Documento} />
        <Stack.Screen name="Procesos" component={Procesos} />
        <Stack.Screen name="Instrucciones" component={Instrucciones} />
        <Stack.Screen name="Formatos" component={Formatos} />
        <Stack.Screen name="Pendientes" component={Pendientes} />


        <Stack.Screen name="Quimicos" component={Quimicos} />
        <Stack.Screen name="Fds" component={Fds} />
        <Stack.Screen name="DocumentosPQ" component={DocumentosPQ} />
        <Stack.Screen name="DocumentoPQ" component={DocumentoPQ} />
        <Stack.Screen name="FormacionesPQ" component={FormacionesPQ} />
        <Stack.Screen name="FormacionPQ" component={FormacionPQ} />
        <Stack.Screen name="GestionQuimicos" component={GestionQuimicos} />


        <Stack.Screen name="NoConformidades" component={NoConformidades} />
        <Stack.Screen name="ListadoTotalNC" component={ListadoNC} />
        <Stack.Screen name="ListadoAbiertas" component={ListadoAbiertas} />
        <Stack.Screen name="ListadoPendientes" component={ListadoPendientes} />
        <Stack.Screen name="NoConformidad" component={NoConformidad} />
        <Stack.Screen name="Correctivas" component={Correctivas} />

        
        <Stack.Screen name="RecursosHumanos" component={RecursosHumanos} />
        <Stack.Screen name="PersonalFicha" component={PersonalFicha} />
        <Stack.Screen name="PersonalGeneral" component={PersonalGeneral} />
        <Stack.Screen name="PersonalFormaciones" component={PersonalFormaciones}/>
        <Stack.Screen name="PersonalPuestos" component={PersonalPuestos} />
        <Stack.Screen name="DocumentosPuesto" component={DocumentosPuesto} />
        <Stack.Screen name="PersonalSecciones" component={PersonalSecciones} />
        <Stack.Screen name="PersonalPuestosSeccion" component={PersonalPuestosSeccion} />
        <Stack.Screen name="PersonalLista" component={PersonalLista} />


        <Stack.Screen name="InformeNuevo" component={InformeNuevo} />
        <Stack.Screen name="GestionInformes" component={GestionInformes} />
        <Stack.Screen name="InformesLista" component={InformesLista} />
        <Stack.Screen name="InformeStandard" component={InformeStandard} />
        <Stack.Screen name="InformeAH" component={InformeAH} />
        <Stack.Screen name="Informe5s" component={Informe5s} />
        <Stack.Screen name="Informe5sRespondido" component={Informe5sRespondido} />
        

        <Stack.Screen name="Equipos" component={Equipos} />
        <Stack.Screen name="ListaEquipos" component={ListaEquipos} />
        <Stack.Screen name="DatosEquipo" component={DatosEquipo} />
        <Stack.Screen name="GeneralEquipos" component={GeneralEquipos} />
        <Stack.Screen name="PlanificacionesEquipos" component={PlanificacionesEquipos}/>
        <Stack.Screen name="RevisionesEquipo" component={RevisionesEquipo} />
        <Stack.Screen name="CalendarioEquipos" component={CalendarioEquipos} />

        
        <Stack.Screen name="GestionResiduos" component={GestionResiduos} />
        <Stack.Screen name="MisRetiradas" component={MisRetiradas} />
        <Stack.Screen name="MisResiduos" component={MisResiduos} />
        <Stack.Screen name="MisGestiones" component={MisGestiones} />
        <Stack.Screen name="NuevaRetirada" component={NuevaRetirada} />
       
       
        <Stack.Screen name="RequisitosLegales" component={RequisitosLegales} />
        <Stack.Screen name="MedioAmbiente" component={MedioAmbiente} />
        <Stack.Screen name="SegIndustrial" component={SegIndustrial} />
        <Stack.Screen name="SegLaboral" component={SegLaboral} />
        <Stack.Screen name="ListaRequisitos" component={ListaRequisitos} />
        <Stack.Screen name="FichaRequisito" component={FichaRequisito} />
        <Stack.Screen name="PendientesLeer" component={PendientesLeer} />


        <Stack.Screen name="Auditorias" component={Auditorias} />
        <Stack.Screen name="Auditoria" component={Auditoria} />
        <Stack.Screen name="NuevaRuta" component={NuevaRuta} />




  
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
