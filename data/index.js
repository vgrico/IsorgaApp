import { icons, images } from "../constants";

export const friends = [
    {
        id: "1",
        name: "Tynisa Obey",
        phoneNumber: "+1-300-400-0135",
        avatar: images.user1,
    },
    {
        id: "2",
        name: "Florencio Dorance",
        phoneNumber: "+1-309-900-0135",
        avatar: images.user2,
    },
    {
        id: "3",
        name: "Chantal Shelburne",
        phoneNumber: "+1-400-100-1009",
        avatar: images.user3,
    },
    {
        id: "4",
        name: "Maryland Winkles",
        phoneNumber: "+1-970-200-4550",
        avatar: images.user4,
    },
    {
        id: "5",
        name: "Rodolfo Goode",
        phoneNumber: "+1-100-200-9800",
        avatar: images.user5,
    },
    {
        id: "6",
        name: "Benny Spanbauer",
        phoneNumber: "+1-780-200-9800",
        avatar: images.user6,
    },
    {
        id: "7",
        name: "Tyra Dillon",
        phoneNumber: "+1-943-230-9899",
        avatar: images.user7,
    },
    {
        id: "8",
        name: "Jamel Eusobio",
        phoneNumber: "+1-900-234-9899",
        avatar: images.user8,
    },
    {
        id: "9",
        name: "Pedro Haurad",
        phoneNumber: "+1-240-234-9899",
        avatar: images.user9
    },
    {
        id: "10",
        name: "Clinton Mcclure",
        phoneNumber: "+1-500-234-4555",
        avatar: images.user10
    },
];

export const faqKeywords = [
    {
        id: "1",
        name: "General"
    },
    {
        id: "2",
        name: "Account"
    },
    {
        id: "3",
        name: "Security"
    },
    {
        id: "4",
        name: "Booking"
    },
    {
        id: "5",
        name: "Payment"
    }
];

export const faqs = [
    {
        question: 'How do I search for events on the app?',
        answer: 'To search for events, simply enter your preferences, event dates, and location. Then browse through the available options.',
        type: "General"
    },
    {
        question: 'Can I view virtual tours of event venues on this app?',
        answer: 'Yes, you can view virtual tours of event venues. Look for the "Virtual Tour" option on the venue listings to explore them virtually.',
        type: "General"
    },
    {
        question: 'What should I do if I need to cancel or modify an event reservation?',
        answer: 'To cancel or modify an event reservation, go to the "My Bookings" section, find your reservation, and follow the provided options to make changes.',
        type: "Account"
    },
    {
        question: 'How can I find events with specific features or amenities?',
        answer: 'You can use the app’s search filters to find events with specific features or amenities. Filter results by categories such as music, sports, or conferences.',
        type: "Booking"
    },
    {
        question: 'Is there a way to make payments for event bookings within the app?',
        answer: 'Yes, you can securely make payments for event bookings using various payment methods available in the app, including credit/debit cards and digital wallets.',
        type: "Payment"
    },
    {
        question: 'Are my personal details and booking information kept secure?',
        answer: 'Yes, we prioritize the security and confidentiality of your personal details and booking information. Our app complies with strict privacy and data protection standards.',
        type: "Security"
    },
    {
        question: 'Can I request additional assistance with special requirements or preferences for an event?',
        answer: "Yes, you can request additional assistance with special requirements or preferences during the booking process. Simply specify your preferences, and we'll do our best to accommodate them.",
        type: "General"
    },
    {
        question: 'How can I provide feedback or rate my event experience?',
        answer: 'After attending an event, you can provide feedback and rate your experience through the app’s rating and review system. Your feedback helps us improve our services for future attendees.',
        type: "General"
    },
    {
        question: 'Is customer support available through this app?',
        answer: 'While we provide event booking services, our app is not for customer support. For assistance, please contact our support team through the designated channels provided in the app.',
        type: "General"
    },
];

export const messsagesData = [
    {
        id: "1",
        fullName: "Jhon Smith",
        isOnline: false,
        userImg: images.user1,
        lastSeen: "2023-11-16T04:52:06.501Z",
        lastMessage: 'I love you. see you soon baby',
        messageInQueue: 2,
        lastMessageTime: "12:25 PM",
        isOnline: true,
    },
    {
        id: "2",
        fullName: "Anuska Sharma",
        isOnline: false,
        userImg: images.user2,
        lastSeen: "2023-11-18T04:52:06.501Z",
        lastMessage: 'I Know. you are so busy man.',
        messageInQueue: 0,
        lastMessageTime: "12:15 PM",
        isOnline: false
    },
    {
        id: "3",
        fullName: "Virat Kohili",
        isOnline: false,
        userImg: images.user3,
        lastSeen: "2023-11-20T04:52:06.501Z",
        lastMessage: 'Ok, see u soon',
        messageInQueue: 0,
        lastMessageTime: "09:12 PM",
        isOnline: true
    },
    {
        id: "4",
        fullName: "Shikhor Dhaon",
        isOnline: false,
        userImg: images.user4,
        lastSeen: "2023-11-18T04:52:06.501Z",
        lastMessage: 'Great! Do you Love it.',
        messageInQueue: 0,
        lastMessageTime: "04:12 PM",
        isOnline: true
    },
    {
        id: "5",
        fullName: "Shakib Hasan",
        isOnline: false,
        userImg: images.user5,
        lastSeen: "2023-11-21T04:52:06.501Z",
        lastMessage: 'Thank you !',
        messageInQueue: 2,
        lastMessageTime: "10:30 AM",
        isOnline: true
    },
    {
        id: "6",
        fullName: "Jacksoon",
        isOnline: false,
        userImg: images.user6,
        lastSeen: "2023-11-20T04:52:06.501Z",
        lastMessage: 'Do you want to go out dinner',
        messageInQueue: 3,
        lastMessageTime: "10:05 PM",
        isOnline: false
    },
    {
        id: "7",
        fullName: "Tom Jerry",
        isOnline: false,
        userImg: images.user7,
        lastSeen: "2023-11-20T04:52:06.501Z",
        lastMessage: 'Do you want to go out dinner',
        messageInQueue: 2,
        lastMessageTime: "11:05 PM",
        isOnline: true
    },
    {
        id: "8",
        fullName: "Lucky Luck",
        isOnline: false,
        userImg: images.user8,
        lastSeen: "2023-11-20T04:52:06.501Z",
        lastMessage: 'Can you share the design with me?',
        messageInQueue: 2,
        lastMessageTime: "09:11 PM",
        isOnline: true
    },
    {
        id: "9",
        fullName: "Nate Jack",
        isOnline: false,
        userImg: images.user9,
        lastSeen: "2023-11-20T04:52:06.501Z",
        lastMessage: 'Tell me what you want?',
        messageInQueue: 0,
        lastMessageTime: "06:43 PM",
        isOnline: true
    }
];

export const callData = [
    {
        id: "1",
        fullName: "Roselle Erhman",
        userImg: images.user10,
        status: "Incoming",
        date: "Dec 19, 2024"
    },
    {
        id: "2",
        fullName: "Willard Purnell",
        userImg: images.user9,
        status: "Outgoing",
        date: "Dec 17, 2024"
    },
    {
        id: "3",
        fullName: "Charlotte Hanlin",
        userImg: images.user8,
        status: "Missed",
        date: "Dec 16, 2024"
    },
    {
        id: "4",
        fullName: "Merlin Kevin",
        userImg: images.user7,
        status: "Missed",
        date: "Dec 16, 2024"
    },
    {
        id: "5",
        fullName: "Lavern Laboy",
        userImg: images.user6,
        status: "Outgoing",
        date: "Dec 16, 2024"
    },
    {
        id: "6",
        fullName: "Phyllis Godley",
        userImg: images.user5,
        status: "Incoming",
        date: "Dec 15, 2024"
    },
    {
        id: "7",
        fullName: "Tyra Dillon",
        userImg: images.user4,
        status: "Outgoing",
        date: "Dec 15, 2024"
    },
    {
        id: "8",
        fullName: "Marci Center",
        userImg: images.user3,
        status: "Missed",
        date: "Dec 15, 2024"
    },
    {
        id: "9",
        fullName: "Clinton Mccure",
        userImg: images.user2,
        status: "Outgoing",
        date: "Dec 15, 2024"
    },
];

export const banners = [
    {
      id: 1,
      discount: '40%',
      discountName: "Today's Special",
      bottomTitle: 'Get a discount for every event booking!',
      bottomSubtitle: 'Only valid for today!'
    },
    {
      id: 2,
      discount: '50%',
      discountName: "Weekend Sale",
      bottomTitle: 'Special discount for weekend bookings!',
      bottomSubtitle: 'This weekend only!'
    },
    {
      id: 3,
      discount: '30%',
      discountName: "Limited Time Offer",
      bottomTitle: 'Hurry up! Limited time offer!',
      bottomSubtitle: 'Valid until supplies last!'
    }
];

export const featuredEvents = [
    {
        id: "1",
        name: "Tech Summit 2024",
        image: images.event1,
        date: "2024-06-15",
        startTime: "09:00",
        endTime: "18:00",
        location: "New York, US",
        categoryId: "2",
        isFree: true
    },
    {
        id: "2",
        name: "Music Festival Jakarta",
        image: images.event2,
        date: "2024-08-20",
        startTime: "14:00",
        endTime: "23:00",
        location: "Jakarta, Indonesia",
        categoryId: "3",
        isFree: false
    },
    {
        id: "3",
        name: "London Fashion Week",
        image: images.event3,
        date: "2024-10-05",
        startTime: "10:00",
        endTime: "20:00",
        location: "London, UK",
        categoryId: "4",
        isFree: false
    },
    {
        id: "4",
        name: "LA Film Festival",
        image: images.event4,
        date: "2024-09-15",
        startTime: "12:00",
        endTime: "22:00",
        location: "Los Angeles, US",
        categoryId: "2",
        isFree: true
    },
    {
        id: "5",
        name: "Zurich Food Expo",
        image: images.event5,
        date: "2024-07-10",
        startTime: "11:00",
        endTime: "19:00",
        location: "Zurich, Switzerland",
        categoryId: "2",
        isFree: false
    },
    {
        id: "6",
        name: "Tuscany Wine Tasting",
        image: images.event6,
        date: "2024-08-30",
        startTime: "15:00",
        endTime: "21:00",
        location: "Tuscany, Italy",
        categoryId: "3",
        isFree: false
    },
    {
        id: "7",
        name: "Berlin Art Fair",
        image: images.event7,
        date: "2024-09-25",
        startTime: "10:00",
        endTime: "18:00",
        location: "Berlin, Germany",
        categoryId: "3",
        isFree: false
    },
    {
        id: "8",
        name: "Toronto Jazz Festival",
        image: images.event8,
        date: "2024-07-05",
        startTime: "16:00",
        endTime: "23:00",
        location: "Toronto, Canada",
        categoryId: "4",
        isFree: true
    },
    {
        id: "9",
        name: "Dubai Luxury Expo",
        image: images.event9,
        date: "2024-11-15",
        startTime: "09:00",
        endTime: "20:00",
        location: "Dubai, UAE",
        categoryId: "3",
        isFree: false
    },
];

export const recommendedEvents = [
    {
        id: "1",
        name: "Hawaiian Luau Extravaganza",
        image: images.event9,
        date: "2024-07-20",
        startTime: "18:00",
        endTime: "23:00",
        location: "Maui, Hawaii",
        categoryId: "3",
        isFree: true
    },
    {
        id: "2",
        name: "Banff Mountain Adventure Tour",
        image: images.event8,
        date: "2024-08-10",
        startTime: "08:00",
        endTime: "17:00",
        location: "Banff, Canada",
        categoryId: "4",
        isFree: false
    },
    {
        id: "3",
        name: "Parisian Historical Walking Tour",
        image: images.event7,
        date: "2024-09-05",
        startTime: "10:00",
        endTime: "16:00",
        location: "Paris, France",
        categoryId: "2",
        isFree: false
    },
    {
        id: "4",
        name: "Black Forest Nature Hike",
        image: images.event6,
        date: "2024-06-25",
        startTime: "09:00",
        endTime: "14:00",
        location: "Black Forest, Germany",
        categoryId: "2",
        isFree: false
    },
    {
        id: "5",
        name: "Safari Adventure in Maasai Mara",
        image: images.event5,
        date: "2024-07-15",
        startTime: "07:00",
        endTime: "18:00",
        location: "Maasai Mara, Kenya",
        categoryId: "4",
        isFree: true
    },
    {
        id: "6",
        name: "Lake District Boat Cruise",
        image: images.event4,
        date: "2024-08-30",
        startTime: "11:00",
        endTime: "15:00",
        location: "Lake District, UK",
        categoryId: "2",
        isFree: false
    },
    {
        id: "7",
        name: "Aspen Mountain Yoga Retreat",
        image: images.event3,
        date: "2024-09-10",
        startTime: "08:00",
        endTime: "12:00",
        location: "Aspen, US",
        categoryId: "5",
        isFree: false
    },
    {
        id: "8",
        name: "Tokyo City Nightlife Tour",
        image: images.event2,
        date: "2024-07-05",
        startTime: "20:00",
        endTime: "02:00",
        location: "Tokyo, Japan",
        categoryId: "3",
        isFree: true
    },
    {
        id: "9",
        name: "Provence Countryside Cycling Adventure",
        image: images.event1,
        date: "2024-08-20",
        startTime: "09:00",
        endTime: "16:00",
        location: "Provence, France",
        categoryId: "2",
        isFree: true
    },
];

export const getAnimeCharacters = async () => {
    try {
        const response = await fetch('https://momdel.es/animeWorld/api/listadoPersonajesFav.php');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const datos = await response.json();
        // Transforma los datos en el formato deseado
        const characters = datos.map(item => ({
            id: item.id.toString(),
            name: item.nombre,
            image: item.imagen, // Asumiendo que 'imagen' es la URL de la imagen
            date: item.fecha_nacimiento, // Cambiar según corresponda
            startTime: item.altura, // Cambiar según corresponda
            endTime: item.edad, // Cambiar según corresponda
            location: item.peso, // Cambiar según corresponda
            isFree: item.vivo === true // Cambiar según corresponda
        }));
        return characters;
    } catch (error) {
        console.error('Error fetching data:', error);
        // Puedes manejar el error según sea necesario, como mostrar un mensaje al usuario
        return []; // Devuelve un array vacío en caso de error
    }
};

export const getAnimeCharactersPrueba = async (parametro1, parametro2) => {
    try {
        const response = await fetch(`https://momdel.es/animeWorld/api/listadoPersonajesFav.php?parametro1=${parametro1}&parametro2=${parametro2}`);        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const datos = await response.json();
        // Transforma los datos en el formato deseado
        const characters = datos.map(item => ({
            id: item.id.toString(),
            name: item.nombre,
            image: item.imagen, // Asumiendo que 'imagen' es la URL de la imagen
            date: item.fecha_nacimiento, // Cambiar según corresponda
            startTime: item.altura, // Cambiar según corresponda
            endTime: item.edad, // Cambiar según corresponda
            location: item.peso, // Cambiar según corresponda
            isFree: item.vivo === true // Cambiar según corresponda
        }));
        return characters;
    } catch (error) {
        console.error('Error fetching data:', error);
        // Puedes manejar el error según sea necesario, como mostrar un mensaje al usuario
        return []; // Devuelve un array vacío en caso de error
    }
};


export const listarSeries = async () => {
    try {
        const response = await fetch('https://momdel.es/animeWorld/api/listadoSeries.php');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const datos = await response.json();
        // Transforma los datos en el formato deseado
        const characters = datos.map(item => ({
            id: item.id.toString(),
            name: item.nombre,
            image: item.imagen1, // Asumiendo que 'imagen' es la URL de la imagen
            date: "",
            startTime: "",
            endTime: "",
            location: "",
            categoryId: "3",
            isFree: true

        }));
        return characters;
    } catch (error) {
        console.error('Error fetching data:', error);
        // Puedes manejar el error según sea necesario, como mostrar un mensaje al usuario
        return []; // Devuelve un array vacío en caso de error
    }
};

export const listarSeriesMias = async (userId) => {
    try {
        const response = await fetch(`https://momdel.es/animeWorld/api/listadoSeriesMias.php?id=${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const datos = await response.json();
        // Transforma los datos en el formato deseado
        const characters = datos.map(item => ({
            id: item.id.toString(),
            name: item.nombre,
            image: item.imagen1,
            estado: item.estado,
            capitulo: item.capitulo,
            nCapitulos: item.n_capitulos,
            completado: item.completado,
            intentos: item.intentos,
            date: "",
            startTime: "",
            endTime: "",
            location: "",
            categoryId: "3",
            isFree: true

        }));
        return characters;
    } catch (error) {
        console.error('Error fetching data:', error);
        // Puedes manejar el error según sea necesario, como mostrar un mensaje al usuario
        return []; // Devuelve un array vacío en caso de error
    }
};

export const listarSeriesMiasExamen = async (userId) => {
    try {
        const response = await fetch(`https://momdel.es/animeWorld/api/listadoSeriesMiasExamen.php?id=${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const datos = await response.json();
        // Mapea los datos para darles el formato deseado
        const series = datos.map(item => ({
            id: item.id.toString(),
            name: item.nombre,
            image: item.imagen1,
            startTime: "",
            endTime: "",
            date: "",
            location: "",
            capitulo: item.capitulo,
            nCapitulos: item.n_capitulos,
            completado: item.completado,
            intentos: item.intentos,
            categoryId: "3",
            isFree: true
        }));
        return series;
    } catch (error) {
        console.error('Error fetching serie data:', error);
        // Puedes manejar el error según sea necesario, como mostrar un mensaje al usuario
        return []; // Devuelve un array vacío en caso de error
    }
};




export const myFavouriteEvents = [
    {
        id: "1",
        name: "Hawaiian Luau Extravaganza",
        image: images.event9,
        date: "2024-07-20",
        startTime: "18:00",
        endTime: "23:00",
        location: "Maui, Hawaii",
        categoryId: "3",
        isFree: true
    },
    {
        id: "2",
        name: "Banff Mountain Adventure Tour",
        image: images.event8,
        date: "2024-08-10",
        startTime: "08:00",
        endTime: "17:00",
        location: "Banff, Canada",
        categoryId: "4",
        isFree: false
    },
    {
        id: "3",
        name: "Parisian Historical Walking Tour",
        image: images.event7,
        date: "2024-09-05",
        startTime: "10:00",
        endTime: "16:00",
        location: "Paris, France",
        categoryId: "2",
        isFree: false
    },
    {
        id: "4",
        name: "Black Forest Nature Hike",
        image: images.event6,
        date: "2024-06-25",
        startTime: "09:00",
        endTime: "14:00",
        location: "Black Forest, Germany",
        categoryId: "2",
        isFree: false
    },
    {
        id: "5",
        name: "Safari Adventure in Maasai Mara",
        image: images.event5,
        date: "2024-07-15",
        startTime: "07:00",
        endTime: "18:00",
        location: "Maasai Mara, Kenya",
        categoryId: "4",
        isFree: true
    },
    {
        id: "6",
        name: "Lake District Boat Cruise",
        image: images.event4,
        date: "2024-08-30",
        startTime: "11:00",
        endTime: "15:00",
        location: "Lake District, UK",
        categoryId: "2",
        isFree: false
    },
    {
        id: "7",
        name: "Aspen Mountain Yoga Retreat",
        image: images.event3,
        date: "2024-09-10",
        startTime: "08:00",
        endTime: "12:00",
        location: "Aspen, US",
        categoryId: "5",
        isFree: false
    },
    {
        id: "8",
        name: "Tokyo City Nightlife Tour",
        image: images.event2,
        date: "2024-07-05",
        startTime: "20:00",
        endTime: "02:00",
        location: "Tokyo, Japan",
        categoryId: "3",
        isFree: true
    },
    {
        id: "9",
        name: "Provence Countryside Cycling Adventure",
        image: images.event1,
        date: "2024-08-20",
        startTime: "09:00",
        endTime: "16:00",
        location: "Provence, France",
        categoryId: "2",
        isFree: true
    },
];

export const allEvents = [
    {
        id: "1",
        name: "Beachside Yoga Retreat",
        image: images.event9,
        date: "2024-07-20",
        startTime: "08:00",
        endTime: "12:00",
        location: "Maui, Hawaii",
        categoryId: "3",
        facilities: ["Yoga Sessions", "Beach Access", "Healthy Meals"],
        isFree: false
    },
    {
        id: "2",
        name: "Mountain Adventure Expedition",
        image: images.event8,
        date: "2024-08-10",
        startTime: "07:00",
        endTime: "17:00",
        location: "Banff, Canada",
        categoryId: "4",
        facilities: ["Hiking Trails", "Outdoor Activities", "Picnic Lunch"],
        isFree: true
    },
    {
        id: "3",
        name: "Historical City Walking Tour",
        image: images.event7,
        date: "2024-09-05",
        startTime: "10:00",
        endTime: "14:00",
        location: "Paris, France",
        categoryId: "2",
        facilities: ["Guided Tour", "Historical Sites", "Cultural Experience"],
        isFree: false
    },
    {
        id: "4",
        name: "Forest Meditation Retreat",
        image: images.event6,
        date: "2024-06-25",
        startTime: "09:00",
        endTime: "13:00",
        location: "Black Forest, Germany",
        categoryId: "2",
        facilities: ["Meditation Sessions", "Nature Walks", "Peaceful Environment"],
        isFree: false
    },
    {
        id: "5",
        name: "Safari Wildlife Expedition",
        image: images.event5,
        date: "2024-07-15",
        startTime: "06:00",
        endTime: "18:00",
        location: "Maasai Mara, Kenya",
        categoryId: "4",
        facilities: ["Game Drives", "Wildlife Sightings", "Bush Breakfast"],
        isFree: false
    },
    {
        id: "6",
        name: "Lake District Photography Tour",
        image: images.event4,
        date: "2024-08-30",
        startTime: "11:00",
        endTime: "16:00",
        location: "Lake District, UK",
        categoryId: "2",
        facilities: ["Photography Lessons", "Scenic Spots", "Professional Guide"],
        isFree: true
    },
    {
        id: "7",
        name: "Mountain Yoga and Wellness Retreat",
        image: images.event3,
        date: "2024-09-10",
        startTime: "08:00",
        endTime: "12:00",
        location: "Aspen, US",
        categoryId: "5",
        facilities: ["Yoga Sessions", "Meditation", "Wellness Workshops"],
        isFree: false
    },
    {
        id: "8",
        name: "Tokyo Night Food Tour",
        image: images.event2,
        date: "2024-07-05",
        startTime: "19:00",
        endTime: "23:00",
        location: "Tokyo, Japan",
        categoryId: "3",
        facilities: ["Food Tasting", "Nightlife Experience", "Local Guide"],
        isFree: true
    },
    {
        id: "9",
        name: "Provence Countryside Painting Workshop",
        image: images.event1,
        date: "2024-08-20",
        startTime: "09:00",
        endTime: "15:00",
        location: "Provence, France",
        categoryId: "2",
        facilities: ["Painting Classes", "Scenic Views", "Art Supplies Provided"],
        isFree: false
    },
];

export const organizerEvents = [
    {
        id: "1",
        name: "Beachside Yoga Retreat",
        image: images.event9,
        date: "2024-07-20",
        startTime: "08:00",
        endTime: "12:00",
        location: "Maui, Hawaii",
        categoryId: "3",
        facilities: ["Yoga Sessions", "Beach Access", "Healthy Meals"],
        isFree: false
    },
    {
        id: "2",
        name: "Mountain Adventure Expedition",
        image: images.event8,
        date: "2024-08-10",
        startTime: "07:00",
        endTime: "17:00",
        location: "Banff, Canada",
        categoryId: "4",
        facilities: ["Hiking Trails", "Outdoor Activities", "Picnic Lunch"],
        isFree: true
    },
    {
        id: "3",
        name: "Historical City Walking Tour",
        image: images.event7,
        date: "2024-09-05",
        startTime: "10:00",
        endTime: "14:00",
        location: "Paris, France",
        categoryId: "2",
        facilities: ["Guided Tour", "Historical Sites", "Cultural Experience"],
        isFree: false
    },
    {
        id: "4",
        name: "Forest Meditation Retreat",
        image: images.event6,
        date: "2024-06-25",
        startTime: "09:00",
        endTime: "13:00",
        location: "Black Forest, Germany",
        categoryId: "2",
        facilities: ["Meditation Sessions", "Nature Walks", "Peaceful Environment"],
        isFree: false
    },
    {
        id: "5",
        name: "Safari Wildlife Expedition",
        image: images.event5,
        date: "2024-07-15",
        startTime: "06:00",
        endTime: "18:00",
        location: "Maasai Mara, Kenya",
        categoryId: "4",
        facilities: ["Game Drives", "Wildlife Sightings", "Bush Breakfast"],
        isFree: false
    },
    {
        id: "6",
        name: "Lake District Photography Tour",
        image: images.event4,
        date: "2024-08-30",
        startTime: "11:00",
        endTime: "16:00",
        location: "Lake District, UK",
        categoryId: "2",
        facilities: ["Photography Lessons", "Scenic Spots", "Professional Guide"],
        isFree: true
    },
    {
        id: "7",
        name: "Mountain Yoga and Wellness Retreat",
        image: images.event3,
        date: "2024-09-10",
        startTime: "08:00",
        endTime: "12:00",
        location: "Aspen, US",
        categoryId: "5",
        facilities: ["Yoga Sessions", "Meditation", "Wellness Workshops"],
        isFree: false
    },
    {
        id: "8",
        name: "Tokyo Night Food Tour",
        image: images.event2,
        date: "2024-07-05",
        startTime: "19:00",
        endTime: "23:00",
        location: "Tokyo, Japan",
        categoryId: "3",
        facilities: ["Food Tasting", "Nightlife Experience", "Local Guide"],
        isFree: true
    },
    {
        id: "9",
        name: "Provence Countryside Painting Workshop",
        image: images.event1,
        date: "2024-08-20",
        startTime: "09:00",
        endTime: "15:00",
        location: "Provence, France",
        categoryId: "2",
        facilities: ["Painting Classes", "Scenic Views", "Art Supplies Provided"],
        isFree: false
    },
];

export const organizerCollections = [
    {
        id: "1",
        image: images.event1
    },
    {
        id: "2",
        image: images.event2
    },
    {
        id: "3",
        image: images.event3
    },
    {
        id: "4",
        image: images.event4
    },
    {
        id: "5",
        image: images.event5
    },
    {
        id: "6",
        image: images.event6
    },
    {
        id: "7",
        image: images.event7
    },
    {
        id: "8",
        image: images.event8
    },
    {
        id: "9",
        image: images.event9
    },
    {
        id: "10",
        image: images.event10
    },
    {
        id: "11",
        image: images.event11
    },
    {
        id: "12",
        image: images.event12
    },
    {
        id: "13",
        image: images.event13
    },
    {
        id: "14",
        image: images.event14
    },
    {
        id: "15",
        image: images.event15
    },
    {
        id: "16",
        image: images.event16
    },
    {
        id: "17",
        image: images.event17
    },
    {
        id: "18",
        image: images.event18
    },
    {
        id: "19",
        image: images.event19
    },
    {
        id: "20",
        image: images.event20
    },
    {
        id: "21",
        image: images.event21
    }
]


export const categories = [
    {
        id: "1",
        name: "🎉 All"
    },
    {
        id: "2",
        name: "🏟️ Conferences & Seminars"
    },
    {
        id: "3",
        name: "🎶 Music & Concerts"
    },
    {
        id: "4",
        name: "🎭 Arts & Culture"
    },
    {
        id: "5",
        name: "🍽️ Food & Dining"
    },
    {
        id: "6",
        name: "🌳 Outdoor & Adventure"
    },
    {
        id: "7",
        name: "🎨 Workshops & Classes"
    }
];

export const notifications = [
    {
        id: "1",
        icon: icons.chat,
        title: "Kathryn sent you a message",
        description: "Tap to see the message",
        date: "2024-01-16T04:52:06.501Z"
    },
    {
        id: "2",
        icon: icons.box,
        title: "Congratulations! Booking Successful!",
        description: "You have successfully booked an event for 3 days for $90. Enjoy the services!",
        date: "2024-01-23T04:52:06.501Z"
    },
    {
        id: "3",
        icon: icons.chat,
        title: "New Services Available!",
        description: "You can now make multiple book event at once. You can also cancel your booking.",
        date: "2024-01-23T08:52:06.501Z"
    },
    {
        id: "4",
        icon: icons.discount,
        title: "Get 20% Discount for your next booking!",
        description: "For all bookings without requirements",
        date: "2024-01-28T08:52:06.501Z"
    },
    {
        id: "5",
        icon: icons.chat,
        title: "New Category events available!",
        description: "We have added Beach Category. Enjoy our new category!",
        date: "2024-01-29T08:52:06.501Z"
    },
    {
        id: "6",
        icon: icons.box,
        title: "Credit card successfully connected!",
        description: "Credit card has been successfully linked!",
        date: "2024-01-23T04:52:06.501Z"
    },
    {
        id: "7",
        icon: icons.chat,
        title: "Julia sent you a message",
        description: "Tap to see the message",
        date: "2024-01-16T04:52:06.501Z"
    },
    {
        id: "8",
        icon: icons.chat,
        title: "Joanna sent you a message",
        description: "Tap to see the message",
        date: "2024-01-16T04:52:06.501Z"
    },
    {
        id: "9",
        icon: icons.chat,
        title: "Lilia sent you a message",
        description: "Tap to see the message",
        date: "2024-01-16T04:52:06.501Z"
    },
    {
        id: "10",
        icon: icons.box,
        title: "Account Setup Successfully",
        description: "Your account has been created!",
        date: "2024-01-28T04:52:06.501Z"
    },
    {
        id: "11",
        icon: icons.discount,
        title: "Get 50% Discount for First Booking!",
        description: "For all transaction without requirements",
        date: "2024-01-28T08:52:06.501Z"
    },
    {
        id: "12",
        icon: icons.chat,
        title: "Mily sent you a message",
        description: "Tap to see the message",
        date: "2024-01-31T04:52:06.501Z"
    },
];

export const ratings = [
    {
        id: "1",
        title: "All"
    },
    {
        id: "6",
        title: "5"
    },
    {
        id: "5",
        title: "4"
    },
    {
        id: "4",
        title: "3"
    },
    {
        id: "3",
        title: "2"
    },
    {
        id: "2",
        title: "1"
    }
];

export const facilities = [
    {
        id: "1",
        name: "All"
    },
    {
        id: "2",
        name: "Parking"
    },
    {
        id: "3",
        name: "Seating"
    },
    {
        id: "4",
        name: "Catering"
    },
    {
        id: "5",
        name: "Audio/Visual Equipment"
    },
    {
        id: "6",
        name: "WiFi"
    }
];

export const eventReviews = [
    {
        id: "1",
        avatar: images.user1,
        name: "Maria Thompson",
        description: "The National Music Event exceeded my expectations! The venue was outstanding and the staff was exceptionally helpful. Highly recommended! 😍",
        rating: 4.8,
        avgRating: 5,
        date: "2024-01-23T04:52:06.501Z",
        numLikes: 948
    },
    {
        id: "2",
        avatar: images.user2,
        name: "Ethan Harris",
        description: "Attending the National Music Event was an unforgettable experience. The ambiance was perfect and I thoroughly enjoyed every moment.",
        rating: 4.7,
        avgRating: 5,
        date: "2024-01-23T04:52:06.501Z",
        numLikes: 120
    },
    {
        id: "3",
        avatar: images.user3,
        name: "Sophia Martinez",
        description: "Absolutely amazing event! The organization and facilities were top-notch. I'll definitely be attending again!",
        rating: 4.7,
        avgRating: 5,
        date: "2024-01-29T04:52:06.501Z",
        numLikes: 89
    },
    {
        id: "4",
        avatar: images.user4,
        name: "Michael Johnson",
        description: "I thoroughly enjoyed the National Music Event. Everything was well-coordinated, and the performances were outstanding.",
        rating: 4,
        avgRating: 4,
        date: "2024-01-29T04:52:06.501Z",
        numLikes: 384
    },
    {
        id: "5",
        avatar: images.user5,
        name: "Emma Wilson",
        description: "Attending the National Music Event was a delightful experience. The venue was fantastic, and the atmosphere was electrifying. Highly recommend!",
        rating: 4.3,
        avgRating: 4,
        date: "2024-01-29T04:52:06.501Z",
        numLikes: 738
    },
    {
        id: "6",
        avatar: images.user6,
        name: "Oliver Brown",
        description: "Kudos to the organizers of the National Music Event! The arrangements were impeccable, and I had a fantastic time.",
        rating: 4.8,
        avgRating: 5,
        date: "2024-01-29T04:52:06.501Z",
        numLikes: 12
    },
    {
        id: "7",
        avatar: images.user7,
        name: "Isabella White",
        description: "The National Music Event was absolutely phenomenal! I was impressed by the performances and the overall vibe of the event. Can't wait for the next one!",
        rating: 4.9,
        avgRating: 5,
        date: "2024-01-29T04:52:06.501Z",
        numLikes: 450
    }
];

export const gallery = [
    {
        id: "1",
        image: images.event1
    },
    {
        id: "2",
        image: images.event2
    },
    {
        id: "3",
        image: images.event3
    },
    {
        id: "4",
        image: images.event4
    },
    {
        id: "5",
        image: images.event5
    },
    {
        id: "6",
        image: images.event6
    },
    {
        id: "7",
        image: images.event7
    },
    {
        id: "8",
        image: images.event8
    },
    {
        id: "9",
        image: images.event9
    },
    {
        id: "10",
        image: images.event10
    },
    {
        id: "11",
        image: images.event11
    },
    {
        id: "12",
        image: images.event12
    },
    {
        id: "13",
        image: images.event13
    },
    {
        id: "14",
        image: images.event14
    },
    {
        id: "15",
        image: images.event15
    },
    {
        id: "16",
        image: images.event16
    },
    {
        id: "17",
        image: images.event17
    },
    {
        id: "18",
        image: images.event18
    },
    {
        id: "19",
        image: images.event19
    },
    {
        id: "20",
        image: images.event20
    },
    {
        id: "21",
        image: images.event21
    }
];

export const peopleGoing = [
    {
        id: "1",
        name: "Tynisa Obey",
        position: "Music Producer",
        avatar: images.user1,
    },
    {
        id: "2",
        name: "Florencio Dorance",
        position: "Bit Maker",
        avatar: images.user2,
    },
    {
        id: "3",
        name: "Chantal Shelburne",
        position: "Artist",
        avatar: images.user3,
    },
    {
        id: "4",
        name: "Maryland Winkles",
        position: "Song Writer",
        avatar: images.user4,
    },
    {
        id: "5",
        name: "Rodolfo Goode",
        position: "Artist Manager",
        avatar: images.user5,
    },
    {
        id: "6",
        name: "Benny Spanbauer",
        position: "Artist",
        avatar: images.user6,
    },
    {
        id: "7",
        name: "Tyra Dillon",
        position: "Lyric Writer",
        avatar: images.user7,
    },
    {
        id: "8",
        name: "Jamel Eusobio",
        position: "DJ Manager",
        avatar: images.user8,
    },
    {
        id: "9",
        name: "Pedro Haurad",
        position: "Desiger",
        avatar: images.user9
    },
    {
        id: "10",
        name: "Clinton Mcclure",
        position: "Rapper",
        avatar: images.user10
    },
];


export const upcomingEvents = [
    {
      id: 1,
      status: "Scheduled",
      date: "15 Feb, 10:00 AM",
      eventType: 'Live Concert',
      organizer: "Melodic Productions",
      image: images.event1,
      price: 89.99,
      address: "123 Main St, Cityville",
      hasRemindMe: true,
      rating: 4.9,
    },
    {
      id: 2,
      status: "Scheduled",
      date: "16 Feb, 2:00 PM",
      eventType: 'Art Exhibition',
      organizer: "Artistic Vision Gallery",
      image: images.event2,
      price: 49.99,
      address: "456 Oak St, Townsville",
      hasRemindMe: true,
      rating: 4.7
    },
    {
      id: 3,
      status: "Scheduled",
      date: "17 Feb, 9:00 AM",
      eventType: 'Tech Conference',
      organizer: "InnovateTech Summit",
      image: images.event3,
      price: 69.99,
      address: "789 Pine St, Villagetown",
      hasRemindMe: true,
      rating: 4.8
    },
    {
      id: 4,
      status: "Scheduled",
      date: "18 Feb, 3:00 PM",
      eventType: 'Food Festival',
      organizer: "Taste of Culture Festival",
      image: images.event4,
      price: 149.99,
      address: "910 Elm St, Hamlet",
      hasRemindMe: true,
      rating: 4.7
    },
    {
      id: 5,
      status: "Scheduled",
      date: "19 Feb, 11:00 AM",
      eventType: 'Live Music Night',
      organizer: "Groove Central",
      image: images.event5,
      price: 99.99,
      address: "321 Maple St, Suburbia",
      hasRemindMe: true,
      rating: 4.9
    },
    {
      id: 6,
      status: "Scheduled",
      date: "20 Feb, 1:00 PM",
      eventType: 'Tech Startup Expo',
      organizer: "Tech Innovate Expo",
      image: images.event6,
      price: 199.99,
      address: "567 Cedar St, Countryside",
      hasRemindMe: true,
      rating: 4.9
    },
    {
      id: 7,
      status: "Scheduled",
      date: "21 Feb, 10:30 AM",
      eventType: 'Art Workshop',
      organizer: "Creative Minds Workshop",
      image: images.event7,
      price: 79.99,
      address: "890 Oakwood Dr, Riverside",
      hasRemindMe: true,
      rating: 4.9
    },
    {
      id: 8,
      status: "Scheduled",
      date: "22 Feb, 4:00 PM",
      eventType: 'Food Tasting Event',
      organizer: "Flavor Fusion",
      image: images.event8,
      price: 59.99,
      address: "123 Pinecone Ln, Lakeside",
      hasRemindMe: true,
      rating: 4.9
    },
    {
      id: 9,
      status: "Scheduled",
      date: "23 Feb, 12:00 PM",
      eventType: 'Film Screening',
      organizer: "Cinematic Masterpieces",
      image: images.event9,
      price: 299.99,
      address: "456 Redwood Rd, Mountainview",
      hasRemindMe: true,
      rating: 4.6
    },
  ];
  
  export const completedEvents = [
    {
      id: 1,
      status: "Completed",
      date: "12 Feb, 11:30 AM",
      eventType: 'Art Exhibition',
      organizer: "Artistic Vision Gallery",
      image: images.event10,
      price: 129.99,
      address: "789 Pine St, Villagetown",
      hasRemindMe: false,
      rating: 4.9,
    },
    {
      id: 2,
      status: "Completed",
      date: "14 Feb, 3:00 PM",
      eventType: 'Live Music Night',
      organizer: "Groove Central",
      image: images.event11,
      price: 199.99,
      address: "910 Elm St, Hamlet",
      hasRemindMe: false,
      rating: 4.6,
    },
    {
      id: 3,
      status: "Completed",
      date: "16 Feb, 1:30 PM",
      eventType: 'Tech Conference',
      organizer: "InnovateTech Summit",
      image: images.event12,
      price: 349.99,
      address: "321 Maple St, Suburbia",
      hasRemindMe: false,
      rating: 4.7,
    },
    {
      id: 4,
      status: "Completed",
      date: "17 Feb, 12:00 PM",
      eventType: 'Food Tasting Event',
      organizer: "Flavor Fusion",
      image: images.event13,
      price: 499.99,
      address: "567 Cedar St, Countryside",
      hasRemindMe: false,
      rating: 4.9,
    },
    {
      id: 5,
      status: "Completed",
      date: "18 Feb, 2:30 PM",
      eventType: 'Film Screening',
      organizer: "Cinematic Masterpieces",
      image: images.event14,
      price: 79.99,
      address: "890 Oakwood Dr, Riverside",
      hasRemindMe: false,
      rating: 4.6,
    },
    {
      id: 6,
      status: "Completed",
      date: "19 Feb, 11:30 AM",
      eventType: 'Tech Startup Expo',
      organizer: "Tech Innovate Expo",
      image: images.event15,
      price: 129.99,
      address: "123 Pinecone Ln, Lakeside",
      hasRemindMe: false,
      rating: 4.9,
    },
    {
      id: 7,
      status: "Completed",
      date: "20 Feb, 10:00 AM",
      eventType: 'Live Concert',
      organizer: "Melodic Productions",
      image: images.event16,
      price: 39.99,
      address: "456 Redwood Rd, Mountainview",
      hasRemindMe: false,
      rating: 4.9,
    },
    {
      id: 8,
      status: "Completed",
      date: "21 Feb, 3:30 PM",
      eventType: 'Art Workshop',
      organizer: "Creative Minds Workshop",
      image: images.event17,
      price: 299.99,
      address: "789 Elmwood Ave, Lakeshore",
      hasRemindMe: false,
      rating: 4.7,
    },
    {
      id: 9,
      status: "Completed",
      date: "22 Feb, 2:00 PM",
      eventType: 'Food Festival',
      organizer: "Taste of Culture Festival",
      image: images.event18,
      price: 159.99,
      address: "910 Birch St, Brookside",
      hasRemindMe: false,
      rating: 4.8
    },
  ];
  
  export const cancelledEvents = [
    {
      id: 1,
      status: "Cancelled",
      date: "13 Feb, 9:00 AM",
      eventType: 'Film Screening',
      organizer: "Cinematic Masterpieces",
      image: images.event1,
      price: 79.99,
      address: "321 Maple St, Suburbia",
      hasRemindMe: false,
      rating: 4.9,
    },
    {
      id: 2,
      status: "Cancelled",
      date: "14 Feb, 2:00 PM",
      eventType: 'Live Concert',
      organizer: "Melodic Productions",
      image: images.event3,
      price: 99.99,
      address: "567 Cedar St, Countryside",
      hasRemindMe: false,
      rating: 4.7,
    },
    {
      id: 3,
      status: "Cancelled",
      date: "15 Feb, 11:30 AM",
      eventType: 'Art Workshop',
      organizer: "Creative Minds Workshop",
      image: images.event4,
      price: 149.99,
      address: "789 Elmwood Ave, Lakeshore",
      hasRemindMe: false,
      rating: 4.8,
    },
    {
      id: 4,
      status: "Cancelled",
      date: "16 Feb, 3:30 PM",
      eventType: 'Food Tasting Event',
      organizer: "Flavor Fusion",
      image: images.event5,
      price: 69.99,
      address: "123 Main St, Cityville",
      hasRemindMe: false,
      rating: 4.5,
    },
    {
      id: 5,
      status: "Cancelled",
      date: "17 Feb, 1:00 PM",
      eventType: 'Tech Startup Expo',
      organizer: "Tech Innovate Expo",
      image: images.event13,
      price: 199.99,
      address: "456 Oak St, Townsville",
      hasRemindMe: false,
      rating: 4.9,
    },
    {
      id: 6,
      status: "Cancelled",
      date: "18 Feb, 10:00 AM",
      eventType: 'Art Exhibition',
      organizer: "Artistic Vision Gallery",
      image: images.event18,
      price: 79.99,
      address: "789 Pine St, Villagetown",
      hasRemindMe: false,
      rating: 4.9,
    },
    {
      id: 7,
      status: "Cancelled",
      date: "19 Feb, 2:30 PM",
      eventType: 'Live Music Night',
      organizer: "Groove Central",
      image: images.event21,
      price: 59.99,
      address: "910 Elm St, Hamlet",
      hasRemindMe: false,
      rating: 4.9,
    },
    {
      id: 8,
      status: "Cancelled",
      date: "20 Feb, 12:00 PM",
      eventType: 'Tech Conference',
      organizer: "InnovateTech Summit",
      image: images.event20,
      price: 299.99,
      address: "321 Maple St, Suburbia",
      hasRemindMe: false,
      rating: 4.9,
    },
    {
      id: 9,
      status: "Cancelled",
      date: "21 Feb, 9:30 AM",
      eventType: 'Food Festival',
      organizer: "Taste of Culture Festival",
      image: images.event5,
      price: 99.99,
      address: "567 Cedar St, Countryside",
      hasRemindMe: false,
      rating: 4.9,
    },
  ];
