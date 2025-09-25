//codigo JSX

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Swal from "sweetalert2";
import flechas from "../../assets/images/flechas.png";
import lofoform from "../../assets/images/logoform.png";
import "./Referidos.css";
import { countries, cityes } from "../CostantsComponent/dataciudades";
import * as pdfjsLib from "pdfjs-dist";
import { useNavigate } from "react-router-dom";
import { countryCodes } from "../CostantsComponent/PhoneNumbers";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

const EXPERIENCE_LEVELS = [
  "No experience",
  "1–6 months",
  "6 months – 1 year",
  "1–2 years",
  "More than 2 years",
];

const HOW_HEAR_OPTIONS = [
  "Email campaign",
  "Social media ads",
  "Program info banner",
  "On-site activation or event",
  "Corporate onboarding",
  "Other",
];
function FormReferidos() {
  const navigate = useNavigate();
  // Estados para la carga de pdf
  const [cvFile, setCvFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null); // URL para la vista previa
  const [isDragging, setIsDragging] = useState(false); // Estado para el efecto visual de arrastre
  const fileInputRef = useRef(null); // Referencia al input de tipo 'file' oculto

  // Estados para cada campo del formulario
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState(""); // Estado para el código de país
  const [phone, setPhone] = useState("");

  // const [countryAll, setCountryAll]=useState([]);

  const [referralId, setReferralId] = useState("");
  const [, setPreviousWorkExperience] = useState(""); // 'yes', 'no', o ''
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [coments, setComents] = useState("");
  const [selectedAreaRol, setSelectedAreaRol] = useState("");
  const [searchTermArea, setSearchTermArea] = useState(""); // Lo que se muestra en el input de Área
  const [showDropdownArea, setShowDropdownArea] = useState(false); // Controla la visibilidad
  const dropdownRefArea = useRef(null); // Ref para el contenedor del dropdown
  const [showDropdown, setShowDropdown] = useState(false); // Estado para controlar la visibilidad del menú
  const dropdownRef = useRef(null); // Ref para detectar clics fuera del dropdown
  const [searchTermCountry, setSearchTermCountry] = useState("");
  const [showDropdownCountry, setShowDropdownCountry] = useState(false);
  const dropdownRefCountry = useRef(null);
  const inputRefCountry = useRef(null); //

  // Nuevos estados para el campo de Ciudad
  const [searchTermCity, setSearchTermCity] = useState("");
  const [showDropdownCity, setShowDropdownCity] = useState(false);
  const dropdownRefCity = useRef(null);

  // Estados para la lógica de búsqueda de ciudades
  const [availableCities, setAvailableCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [, setFilteredCities] = useState([]);

  const [showDropdownExperience, setShowDropdownExperience] = useState(false);
  const [searchTermExperience, setSearchTermExperience] = useState("");
  const dropdownRefExperience = useRef(null);
  const inputRefExperience = useRef(null);

  const handleSearchChangeExperience = useCallback((e) => {
    setSearchTermExperience(e.target.value);
    setShowDropdownExperience(true);
  }, []);

  const handleOptionClickExperience = useCallback((option) => {
    setSearchTermExperience(option);
    setShowDropdownExperience(false);
  }, []);

  const handleInputFocusExperience = useCallback(() => {
    setShowDropdownExperience(true);
  }, []);

  const filteredExperience = useMemo(() => {
    if (!searchTermExperience) {
      return EXPERIENCE_LEVELS;
    }
    const lowercasedTerm = searchTermExperience.toLowerCase();
    return EXPERIENCE_LEVELS.filter((level) =>
      level.toLowerCase().includes(lowercasedTerm)
    );
  }, [searchTermExperience]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefExperience.current &&
        !dropdownRefExperience.current.contains(event.target)
      ) {
        setShowDropdownExperience(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRefExperience]);

  // Array de códigos de país
  const [showDropdownHowHear, setShowDropdownHowHear] = useState(false);
  const [howHearAbout, setHowHearAbout] = useState(""); // Estado para la opción seleccionada
  const [searchTermHowHear, setSearchTermHowHear] = useState(""); // estado para el valor del input
  const dropdownRefHowHear = useRef(null);

  const filteredHowHearOptions = useMemo(() => {
    if (!searchTermHowHear) {
      return HOW_HEAR_OPTIONS;
    }
    const lowercasedTerm = searchTermHowHear.toLowerCase();
    return HOW_HEAR_OPTIONS.filter((option) =>
      option.toLowerCase().includes(lowercasedTerm)
    );
  }, [searchTermHowHear]);

  const handleSearchChangeHowHear = useCallback((e) => {
    setSearchTermHowHear(e.target.value);
    setShowDropdownHowHear(true);
  }, []);

  const handleInputFocusHowHear = useCallback(() => {
    setSearchTermHowHear(howHearAbout);
    setShowDropdownHowHear(true);
  }, [howHearAbout]);

  const handleOptionClickHowHear = useCallback((option) => {
    setHowHearAbout(option);
    setSearchTermHowHear(option);
    setShowDropdownHowHear(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefHowHear.current &&
        !dropdownRefHowHear.current.contains(event.target)
      ) {
        setShowDropdownHowHear(false);
        // Si el usuario no seleccionó nada, vuelve al valor previo o lo deja vacío
        setSearchTermHowHear(howHearAbout);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRefHowHear, howHearAbout]);

  const options = useMemo(
    () => [
      { rol: "Human Resources" },
      { rol: "IT" },
      { rol: "Marketing" },
      { rol: "Sales" },
      { rol: "Customer Service" },
      { rol: "Collections" },
      { rol: "Legal" },
      { rol: "Logistics" },
      { rol: "Finance" },
    ],
    []
  );
  const [showDropdownEnglish, setShowDropdownEnglish] = useState(false);
  const [englishLevel, setEnglishLevel] = useState("");
  const dropdownRefEnglish = useRef(null);

  const handleInputClickEnglish = useCallback(() => {
    setShowDropdownEnglish((prev) => !prev);
  }, []);

  const handleOptionClickEnglish = useCallback((option) => {
    setEnglishLevel(option);
    setShowDropdownEnglish(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefEnglish.current &&
        !dropdownRefEnglish.current.contains(event.target)
      ) {
        setShowDropdownEnglish(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRefEnglish]);

  // filtro de area to apply
  const filteredAreaApply = options.filter((apply) => {
    const lowerCaseSearchTerm = searchTermArea.toLowerCase();
    return apply.rol.toLowerCase().includes(lowerCaseSearchTerm);
  });
  // **********************************************
  const filteredCities =
    selectedCountry && cityes[selectedCountry.id]
      ? // Si hay un país seleccionado y hay ciudades para ese país
        cityes[selectedCountry.id].filter((city) => {
          const lowerCaseSearchTerm = (searchTermCity ?? "").toLowerCase();

          // Protección robusta para el objeto city y su propiedad 'name'
          const cityNameValue = city?.name ?? "";

          return cityNameValue.toLowerCase().includes(lowerCaseSearchTerm);
        })
      : [];
  //filtro de country y citys
  const filteredCountry = countries.filter((count) => {
    const lowerCaseSearchTerm = (searchTermCountry ?? "").toLowerCase();

    const idValue = String(count?.id ?? ""); // Esto convierte cualquier valor a su representación de string
    const nameValue = String(count?.name ?? ""); // Esto convierte cualquier valor a su representación de string

    return (
      idValue.toLowerCase().includes(lowerCaseSearchTerm) ||
      nameValue.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  const handleSearchChangeCountry = (e) => {
    const value = e.target.value;
    setSearchTermCountry(value);

    // IMPORTANTE: Resetea el país seleccionado cuando el usuario empieza a escribir.
    // Esto es crucial para que el sistema entienda que se está buscando un nuevo país.
    setSelectedCountry(null);

    // Muestra siempre el dropdown si hay algo escrito, o si el input está en foco.
    // La función onFocus ya se encarga de abrirlo, pero esto ayuda a mantenerlo abierto
    // mientras el usuario teclea.
    setShowDropdownCountry(true); // O value.length > 0 si solo quieres que se muestre si hay texto
  };
  const handleInputFocusCountry = () => {
    setShowDropdownCountry(true);

    // Si ya hay un país seleccionado (es decir, selectedCountry no es null)
    // Y el texto actual en el input (searchTermCountry) no es igual al nombre del país seleccionado
    if (selectedCountry && searchTermCountry !== selectedCountry.name) {
      // Entonces, actualiza el estado del input (searchTermCountry)
      // con el nombre del país seleccionado.
      // Usamos String() para asegurar que siempre sea un string, como hemos estado haciendo.
      setSearchTermCountry(String(selectedCountry.name ?? ""));
    }
  };

  // --- NUEVAS FUNCIONES ADAPTADAS para Área de Aplicación ---

  const handleSearchChangeArea = (e) => {
    setSearchTermArea(e.target.value);
    setShowDropdownArea(e.target.value.length > 0);
  };
  const handleInputFocusArea = () => {
    setShowDropdownArea(true);
    if (
      selectedCountry &&
      searchTermCountry !== countries.find((a) => a.id === selectedCountry)?.id
    ) {
      const foundCountry = countries.find((a) => a.id === selectedCountry);
      if (foundCountry) {
        setSearchTermCountry(foundCountry.id);
      }
    }
    // Si ya hay un rol seleccionado y el searchTermArea no es igual al rol,
    // lo rellena con el nombre del rol completo al enfocar.
    if (
      selectedAreaRol &&
      searchTermArea !== options.find((a) => a.rol === selectedAreaRol)?.rol
    ) {
      const foundArea = options.find((a) => a.rol === selectedAreaRol);
      if (foundArea) {
        setSearchTermArea(foundArea.rol);
      }
    }
  };

  const filteredCountryCodes = countryCodes.filter((country) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      country.code.toLowerCase().includes(lowerCaseSearchTerm) ||
      country.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  // Maneja la selección de una opción del menú
  const handleOptionClick = (country) => {
    // 'country' DEBE ser el objeto { code: '...', name: '...' }
    // Añadimos una verificación para asegurarnos de que 'country' no es undefined
    if (country && country.code && country.name) {
      setCountryCode(country.code);
      setSearchTerm(`${country.code} (${country.name})`);
      setShowDropdown(false);
    } else {
      console.error(
        "Error: 'country' o sus propiedades son indefinidas en handleOptionClick",
        country
      );
      // Podrías resetear el searchTerm o manejar el error de otra forma si lo deseas
      setSearchTerm("");
      setCountryCode("");
      setShowDropdown(false);
    }
  };
  const handleOptionClickCountry = (country) => {
    setSearchTermCountry(String(country?.name ?? ""));
    setSelectedCountry(country); // ¡Guarda el objeto país completo!
    setSelectedCity(null); // ¡Importante! Reinicia la ciudad seleccionada al cambiar de país
    setSearchTermCity(""); // Limpia el término de búsqueda de ciudad
    setShowDropdownCountry(false);
  };
  // Maneja el cambio en el campo de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Mostrar dropdown si hay algo escrito O si el input no estaba vacío y ahora tiene foco.
    // Esto asegura que el dropdown se muestre al escribir.
    if (e.target.value.length > 0) {
      setShowDropdown(true);
    } else {
      // Si el input se vacía, oculta el dropdown
      setShowDropdown(false);
    }
  };

  // Maneja el foco en el input para mostrar el dropdown

  const handleInputFocus = () => {
    // Siempre muestra el dropdown cuando el input de código recibe foco
    setShowDropdown(true);

    // Si ya hay un país seleccionado y el searchTerm no tiene el formato completo,
    // lo rellena con el formato completo al enfocar.
    if (countryCode && !searchTerm.includes("(")) {
      const selectedCountry = countryCodes.find((c) => c.code === countryCode);
      if (selectedCountry) {
        setSearchTerm(`${selectedCountry.code} (${selectedCountry.name})`);
      }
    }
  };
  const handleOptionClickCity = (city) => {
    // ¡CAMBIO AQUÍ! Asegura que city.name siempre se convierta a string
    setSearchTermCity(String(city?.name ?? ""));
    setSelectedCity(city);
    setShowDropdownCity(false);
  };
  const handleInputFocusCity = () => {
    setShowDropdownCity(true);
    if (selectedCity && searchTermCity !== selectedCity.name) {
      setSearchTermCity(selectedCity.name);
    }
  };
  const handleSearchChangeCity = (e) => {
    const value = e.target.value;
    setSearchTermCity(value);
    setShowDropdownCity(value.length > 0);
  };

  // Hook para cerrar el dropdown al hacer clic fuera

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        // Cuando se hace clic fuera, si hay un código de país seleccionado,
        // asegura que el input muestre el formato completo.
        if (countryCode) {
          const selectedCountry = countryCodes.find(
            (c) => c.code === countryCode
          );
          if (selectedCountry) {
            setSearchTerm(`${selectedCountry.code} (${selectedCountry.name})`);
          }
        } else {
          setSearchTerm(""); // Si no hay país seleccionado, vacía el input.
        }
      }
      if (
        dropdownRefArea.current &&
        !dropdownRefArea.current.contains(event.target)
      ) {
        setShowDropdownArea(false);
        // Lógica para restaurar el searchTerm si había un área seleccionada
        if (selectedAreaRol) {
          // Usamos selectedAreaRol
          const foundArea = options.find((a) => a.rol === selectedAreaRol); // Aquí se usa 'areasToApply'
          if (foundArea) {
            setSearchTermArea(foundArea.rol);
          }
        } else {
          setSearchTermArea("");
        }
      }
      // Verifica si el clic NO está dentro del dropdown NI dentro del input
      if (
        dropdownRefCountry.current &&
        !dropdownRefCountry.current.contains(event.target) &&
        inputRefCountry.current &&
        !inputRefCountry.current.contains(event.target) // <--- NUEVA CONDICIÓN
      ) {
        setShowDropdownCountry(false);

        if (selectedCountry) {
          setSearchTermCountry(String(selectedCountry.name ?? ""));
        } else {
          setSearchTermCountry("");
        }
      }
      // ...
    };

    document.addEventListener("mousedown", handleClickOutside, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [
    dropdownRef,
    countryCode,

    dropdownRefArea,
    selectedAreaRol,
    options,
    selectedCountry,
    selectedCity,
  ]); // 'countryCodes' se agrega a las dependencias si se usa dentro del efecto

  const handleOptionClickArea = (area) => {
    // 'area' es un objeto { rol: '...' }
    if (area && area.rol) {
      setSelectedAreaRol(area.rol); // Guardas el 'rol' como valor final
      setSearchTermArea(area.rol); // Muestras el 'rol' en el input
      setShowDropdownArea(false);
    } else {
      console.error(
        "Error: 'area' o su propiedad 'rol' son indefinidas en handleOptionClickArea",
        area
      );
      setSearchTermArea("");
      setSelectedAreaRol("");
      setShowDropdownArea(false);
    }
  };
  const HandleNavigateViewReferal = () => {
    navigate("/viewreferidos");
  };
  // Función para limpiar todos los estados del formulario
  const onClose = useCallback(() => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setCountryCode("");
    setPhone("");
    setReferralId("");
    setPreviousWorkExperience("");
    setSelectedCity("");
    setSelectedCountry("");
    setComents("");
    setCvFile(null);
    setSelectedAreaRol("");
    // No necesitas limpiar estados de alerta aquí con SweetAlert2
  }, []);

  // Efecto para crear y revocar la URL de la vista previa cuando cvFile cambia
  useEffect(() => {
    if (cvFile) {
      const url = URL.createObjectURL(cvFile);
      setFilePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setFilePreviewUrl(null);
    }
  }, [cvFile]);

  // --- Manejadores de Drag and Drop (uso de useCallback) ---
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setCvFile(file);
        // Muestra SweetAlert2 para éxito en la carga de archivo (opcional)
        Swal.fire({
          icon: "success",
          title: "¡Uploaded file!",
          text: `"${file.name}" loaded correctly.`,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          customClass: {
            popup: "swal2-custom-success-popup", // Clase personalizada para el color
          },
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid file type",
          text: "Please upload a PDF file.",
          confirmButtonColor: "#d33",
        });
        setCvFile(null); // Asegurarse de que no se guarda un archivo incorrecto
      }
    }
  }, []);

  // --- Manejador para el input de archivo (uso de useCallback) ---
  const handleFileInputChange = useCallback((e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setCvFile(file);
        // Muestra SweetAlert2 para éxito en la carga de archivo (opcional)
        Swal.fire({
          icon: "success",
          title: "File uploaded!", // Changed to English
          text: `"${file.name}" uploaded successfully.`, // Changed to English
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          customClass: {
            popup: "swal2-custom-success-popup",
          },
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid file type",
          text: "Please select a valid PDF, DOC, or DOCX file.",
          confirmButtonColor: "#d33",
        });
        setCvFile(null);
        e.target.value = "";
      }
    } else {
      setCvFile(null);
    }
  }, []);

  const openFileExplorer = useCallback(() => {
    fileInputRef.current.click();
  }, []);
  useEffect(() => {
    if (selectedCountry) {
      setAvailableCities(cityes[selectedCountry] || []);
      setFilteredCities(cityes[selectedCountry] || []);
    } else {
      setAvailableCities([]);
      setFilteredCities([]);
    }
  }, [selectedCountry]);
  useEffect(() => {
    if (searchTerm) {
      setFilteredCities(
        availableCities.filter((city) =>
          city.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredCities(availableCities);
    }
  }, [searchTerm, availableCities]);
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const areAllFieldsEmpty =
        !firstName.trim() &&
        !lastName.trim() &&
        !email.trim() &&
        !countryCode &&
        !phone.trim() &&
        !selectedAreaRol &&
        !referralId.trim() &&
        !selectedCountry &&
        !selectedCity &&
        !cvFile &&
        !coments &&
        !englishLevel &&
        !searchTermHowHear &&
        !searchTermExperience;
      if (areAllFieldsEmpty) {
        Swal.fire({
          icon: "warning",
          title: "All Fields Missing",
          text: "Please fill out all the required fields.",
          confirmButtonColor: "#d33",
        });
        return;
      }
      if (!firstName.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Field",
          text: "Please enter your first name.",
          confirmButtonColor: "#d33",
        });
        return;
      }
      if (!lastName.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Field",
          text: "Please enter your last name.",
          confirmButtonColor: "#d33",
        });
        return;
      }
      if (!email.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Field",
          text: "Please enter your email address.",
          confirmButtonColor: "#d33",
        });
        return;
      }
      if (!countryCode) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Field",
          text: "Please select your phone's country code.",
          confirmButtonColor: "#d33",
        });
        return;
      }
      if (!phone.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Field",
          text: "Please enter your phone number.",
          confirmButtonColor: "#d33",
        });
        return;
      }
      if (!selectedAreaRol) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Field",
          text: "Please select the area you are applying for.",
          confirmButtonColor: "#d33",
        });
        return;
      }
      if (!referralId.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Field",
          text: "Please enter the referral ID.",
          confirmButtonColor: "#d33",
        });
        return;
      }
      if (!selectedCountry) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Field",
          text: "Please select your country of residence.",
          confirmButtonColor: "#d33",
        });
        return;
      }
      if (!selectedCity) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Field",
          text: "Please select your city of residence.",
          confirmButtonColor: "#d33",
        });
        return;
      }
      if (!cvFile) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Field",
          text: "Please upload your CV file.",
          confirmButtonColor: "#d33",
        });
        return;
      }
      if (!englishLevel) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Field",
          text: "Please upload your englishLevel.",
          confirmButtonColor: "#d33",
        });
        return;
      }
      if (!coments) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Field",
          text: "Please upload your comments.",
          confirmButtonColor: "#d33",
        });
        return;
      }
      if (!searchTermHowHear) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Field",
          text: "Please upload your how hear.",
          confirmButtonColor: "#d33",
        });
        return;
      }
      if (!searchTermExperience) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Field",
          text: "Please upload your experience level.",
          confirmButtonColor: "#d33",
        });
        return;
      }
      try {
        Swal.fire({
          icon: "success",
          title: "Form Submitted!",
          text: "Your referral has been successfully created.",
          confirmButtonText: "OK",
          confirmButtonColor: "rgb(220,112,56)",
          customClass: {
            popup: "swal2-custom-success-popup",
          },
        }).then(() => {
          onClose();
        });
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
        Swal.fire({
          icon: "error",
          title: "Error al enviar",
          text: "Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.",
          confirmButtonColor: "#d33",
        });
      }
    },
    [
      firstName,
      lastName,
      email,
      countryCode,
      phone,
      selectedAreaRol,
      referralId,
      selectedCountry,
      selectedCity,
      cvFile,
      coments,
      onClose,
      englishLevel,
      searchTermExperience,
      searchTermHowHear,
    ]
  );
  const countryCodeSelectClasses = `outlined-input-container select-variant country-code-select ${
    showDropdown ? "is-open" : ""
  }`;
  return (
    <div className="form-modal-overlay">
      <div className="form-modal-content">
        <div className="form-header">
          <div className="flecha-titulo">
            <h2>
              Create <font color="#27b9d1">New Referral</font>
            </h2>
            <img className="flechass" src={flechas} alt=""></img>
          </div>
          <img src={lofoform} alt="logo del formulario"></img>
        </div>

        <form onSubmit={handleSubmit} className="referral-form-grid" noValidate>
          <div className="form-left-panel">
            <div
              className="cv-upload-area"
              style={{
                backgroundColor: isDragging ? "#f0f8ff" : "#fff",
                transition: "all 0.3s ease-in-out",
              }}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="cvUploadInput"
                accept=".pdf"
                onChange={handleFileInputChange}
                style={{ display: "none" }}
                ref={fileInputRef}
              />
              {cvFile ? (
                <div className="file-display-container">
                  <p
                    style={{
                      marginTop: "10px",
                      fontWeight: "bold",
                      fontSize: "10px",
                    }}
                  >
                    Selected file: {cvFile.name}
                  </p>
                  {filePreviewUrl && cvFile.type === "application/pdf" && (
                    <div style={{ marginTop: "20px" }}>
                      <div style={{ height: "250px", overflow: "hidden" }}>
                        <iframe
                          src={filePreviewUrl}
                          title="Vista previa del CV"
                          width="100%"
                          height="100%"
                          style={{ border: "none" }}
                        ></iframe>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCvFile(null);
                          setFilePreviewUrl(null);
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                        }}
                        style={{
                          marginTop: "10px",
                          padding: "8px 15px",
                          backgroundColor: "rgb(48, 192, 209)",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Delete File
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="file-upload-prompt-container">
                  <div
                    onClick={openFileExplorer}
                    className="cloud-icon-container"
                  >
                    <svg
                      className="cloud-icon"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.3 12.3c-.6-.7-1.5-1-2.4-1.1h-.2c-.1-.7-.4-1.3-.8-1.9-.5-.6-1.1-1-1.7-1.3s-1.4-.5-2.1-.5c-1.1 0-2.1.3-3 .9-.9.6-1.6 1.3-2 2.3-.4.9-.6 1.9-.6 2.9v.3h-.1c-1.3 0-2.3.4-3.1 1.2s-1.2 1.9-1.2 3.1c0 1.2.4 2.2 1.2 3s1.9 1.2 3.1 1.2h12.5c1.7 0 3.2-.6 4.3-1.8s1.8-2.6 1.8-4.3c0-1.7-.6-3.2-1.8-4.3s-2.6-1.8-4.3-1.8zM18 18H6c-.8 0-1.5-.3-2-.8s-.8-1.2-.8-2c0-.8.3-1.5.8-2s1.2-.8 2-.8h.5l.3-.8c.4-1.1 1.1-2 2.1-2.6s2.2-.9 3.4-.9c.7 0 1.4.1 2.1.4s1.3.7 1.8 1.2c.5.5.9 1.1 1.2 1.8s.4 1.4.4 2.1h.5c.8 0 1.5.3 2 .8s-.8 1.2-.8 2c0 .8-.3 1.5-.8 2s-1.2-.8-2 .8z" />
                    </svg>
                  </div>
                  <h3 id="h3">Upload Resume</h3>
                  <p id="p">
                    Drag and drop your file here or{" "}
                    <label htmlFor="cvUploadInput" className="click-here-label">
                      Click Here
                    </label>{" "}
                    to upload a PDF.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="form-right-panel">
            <div className="form-row">
              <div className="outlined-input-container">
                <input
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <fieldset className="input-outline">
                  <legend className="input-legend">
                    <span>First Name*</span>
                  </legend>
                </fieldset>
              </div>
              <div className="outlined-input-container">
                <input
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                <fieldset className="input-outline">
                  <legend className="input-legend">
                    <span>Last Name*</span>
                  </legend>
                </fieldset>
              </div>
            </div>
            <div className="form-row">
              <div className="outlined-input-container full-width">
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <fieldset className="input-outline">
                  <legend className="input-legend">
                    <span>Email*</span>
                  </legend>
                </fieldset>
              </div>
            </div>
            <div className="form-row phone-section">
              <div className={countryCodeSelectClasses} ref={dropdownRef}>
                <input
                  type="text"
                  id="countryCodeInput"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={handleInputFocus}
                  placeholder="Code"
                  required
                  className="custom-country-code-input"
                />
                <fieldset className="input-outline">
                  <legend className="input-legend">
                    <span>Code*</span>
                  </legend>
                </fieldset>
                {showDropdown && (
                  <ul className="custom-dropdown-menu">
                    {filteredCountryCodes.length > 0 ? (
                      filteredCountryCodes.map((country) => (
                        <li
                          key={country.code}
                          onClick={() => handleOptionClick(country)}
                          className="custom-dropdown-item"
                        >
                          {`${country.code} (${country.name})`}
                        </li>
                      ))
                    ) : (
                      <li className="custom-dropdown-no-results">
                        No results found
                      </li>
                    )}
                  </ul>
                )}
              </div>
              <div className="outlined-input-container phone-input">
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 123456789"
                  required
                />
                <fieldset className="input-outline">
                  <legend className="input-legend">
                    <span>Phone*</span>
                  </legend>
                </fieldset>
              </div>
            </div>
            <div className="form-row">
              <div
                className={`outlined-input-container select-variant country-code-select ${
                  showDropdownArea ? "is-open" : ""
                }`}
                ref={dropdownRefArea}
              >
                <input
                  type="text"
                  id="areaApplyInput"
                  value={searchTermArea}
                  onChange={handleSearchChangeArea}
                  onFocus={handleInputFocusArea}
                  placeholder="Select Area"
                  required
                  className="custom-country-code-input"
                />
                <fieldset className="input-outline">
                  <legend className="input-legend">
                    <span>Area*</span>
                  </legend>
                </fieldset>
                {showDropdownArea && (
                  <ul className="custom-dropdown-menu">
                    {filteredAreaApply.length > 0 ? (
                      filteredAreaApply.map((area, index) => (
                        <li
                          key={area.rol || index}
                          onClick={() => handleOptionClickArea(area)}
                          className="custom-dropdown-item"
                        >
                          {area.rol}
                        </li>
                      ))
                    ) : (
                      <li className="custom-dropdown-no-results">
                        No areas found
                      </li>
                    )}
                  </ul>
                )}
              </div>
              <div className="outlined-input-container">
                <input
                  type="text"
                  id="referralId"
                  placeholder="Referral ID"
                  value={referralId}
                  onChange={(e) => setReferralId(e.target.value)}
                  required
                />
                <fieldset className="input-outline">
                  <legend className="input-legend">
                    <span>Referral ID*</span>
                  </legend>
                </fieldset>
              </div>
            </div>
            <div className="form-row">
              <div
                className={`outlined-input-container select-variant country-code-select ${
                  showDropdownExperience ? "is-open" : ""
                }`}
                ref={dropdownRefExperience}
              >
                <input
                  type="text"
                  id="experienceInput"
                  ref={inputRefExperience}
                  value={searchTermExperience}
                  onChange={handleSearchChangeExperience}
                  onFocus={handleInputFocusExperience}
                  placeholder="Select Experience Level"
                  required
                  className="custom-country-code-input"
                />
                <fieldset className="input-outline">
                  <legend className="input-legend">
                    <span>Experience level*</span>
                  </legend>
                </fieldset>
                {showDropdownExperience && (
                  <ul className="custom-dropdown-menu">
                    {filteredExperience.length > 0 ? (
                      filteredExperience.map((level, index) => (
                        <li
                          key={level}
                          onClick={() => handleOptionClickExperience(level)}
                          className="custom-dropdown-item"
                        >
                          {level}
                        </li>
                      ))
                    ) : (
                      <li className="custom-dropdown-no-results">
                        No experience levels found
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
            <div className="form-row">
              <div
                className={`outlined-input-container select-variant country-code-select ${
                  showDropdownEnglish ? "is-open" : ""
                }`}
                ref={dropdownRefEnglish}
                onClick={handleInputClickEnglish}
              >
                <input
                  type="text"
                  id="englishLevelInput"
                  value={englishLevel}
                  placeholder="Select"
                  required
                  readOnly
                  className="custom-country-code-input"
                />

                <fieldset className="input-outline">
                  <legend className="input-legend">
                    <span>English level +B2?*</span>
                  </legend>
                </fieldset>

                {showDropdownEnglish && (
                  <ul className="custom-dropdown-menu">
                    <li
                      key="yes"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOptionClickEnglish("Yes");
                      }}
                      className="custom-dropdown-item"
                    >
                      Yes
                    </li>
                    <li
                      key="no"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOptionClickEnglish("No");
                      }}
                      className="custom-dropdown-item"
                    >
                      No
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <div className="form-row">
              <div
                className={`outlined-input-container select-variant country-code-select ${
                  showDropdownHowHear ? "is-open" : ""
                }`}
                ref={dropdownRefHowHear}
              >
                <input
                  type="text"
                  id="howHearInput"
                  value={searchTermHowHear}
                  onChange={handleSearchChangeHowHear}
                  onFocus={handleInputFocusHowHear}
                  placeholder="Select"
                  required
                  className="custom-country-code-input"
                />
                <fieldset className="input-outline">
                  <legend className="input-legend">
                    <span>How did you hear about the Referral Program?*</span>
                  </legend>
                </fieldset>
                {showDropdownHowHear && (
                  <ul className="custom-dropdown-menu">
                    {filteredHowHearOptions.length > 0 ? (
                      filteredHowHearOptions.map((option) => (
                        <li
                          key={option}
                          onClick={() => handleOptionClickHowHear(option)}
                          className="custom-dropdown-item"
                        >
                          {option}
                        </li>
                      ))
                    ) : (
                      <li className="custom-dropdown-no-results">
                        No options found
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
            <h3 className="section-title">Other Details</h3>
            <div className="country form-row">
              <div
                className={`outlined-input-container select-variant country-code-select ${
                  showDropdownCountry ? "is-open" : ""
                }`}
                ref={dropdownRefCountry}
              >
                <input
                  type="text"
                  id="countryInput"
                  ref={inputRefCountry}
                  value={searchTermCountry}
                  onChange={handleSearchChangeCountry}
                  onFocus={handleInputFocusCountry}
                  placeholder="Select Country"
                  required
                  className="custom-country-code-input"
                />
                <fieldset className="input-outline">
                  <legend className="input-legend">
                    <span>Country*</span>
                  </legend>
                </fieldset>
                {showDropdownCountry && (
                  <ul className="custom-dropdown-menu">
                    {filteredCountry.length > 0 ? (
                      filteredCountry.map((country, index) => (
                        <li
                          key={country.id || index}
                          onClick={() => handleOptionClickCountry(country)}
                          className="custom-dropdown-item"
                        >
                          {country.name}
                        </li>
                      ))
                    ) : (
                      <li className="custom-dropdown-no-results">
                        No countries found
                      </li>
                    )}
                  </ul>
                )}
              </div>
              {selectedCountry && (
                <div className="form-row">
                  <div
                    className={`outlined-input-container select-variant country-code-select ${
                      showDropdownCity ? "is-open" : ""
                    }`}
                    ref={dropdownRefCity}
                  >
                    <input
                      type="text"
                      id="cityInput"
                      value={searchTermCity}
                      onChange={handleSearchChangeCity}
                      onFocus={handleInputFocusCity}
                      placeholder="Select City"
                      required
                      className="custom-country-code-input"
                      disabled={!selectedCountry}
                    />
                    <fieldset className="input-outline">
                      <legend className="input-legend">
                        <span>City*</span>
                      </legend>
                    </fieldset>
                    {showDropdownCity && (
                      <ul
                        className="custom-dropdown-menu"
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        {filteredCities.length > 0 ? (
                          filteredCities.map((city, index) => (
                            <li
                              key={city.id || index}
                              onClick={() => handleOptionClickCity(city)}
                              className="custom-dropdown-item"
                            >
                              {city.name}
                            </li>
                          ))
                        ) : (
                          <li className="custom-dropdown-no-results">
                            No cities found
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="form-row">
              <div className="outlined-input-container full-width comments-textarea-wrapper">
                <textarea
                  id="coments"
                  placeholder="Comments"
                  value={coments}
                  onChange={(e) => setComents(e.target.value)}
                  rows="10"
                ></textarea>
                <fieldset className="input-outline">
                  <legend className="input-legend">
                    <span>Comments*</span>
                  </legend>
                </fieldset>
              </div>
            </div>
          </div>
          <div className="form-footer">
            <button
              onClick={HandleNavigateViewReferal}
              type="button"
              className="btn-cancel"
            >
              Cancel
            </button>
          </div>
          <div className="form-footer2">
            <button type="submit" className="btn-submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default FormReferidos;

//codigo Css

/* Contenedor del modal: crea un fondo oscuro que cubre toda la pantalla */
.form-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(48, 192, 209, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Contenido principal del modal (el cuadro blanco del formulario) */
.form-modal-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Encabezado del Formulario dentro del modal */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  border-bottom: 1px solid #eee;
}

.form-header h2 {
  margin: 0;
  font-size: 1.5em;
}

/* .close-button {
    background: none; 
    border: none; 
    font-size: 1.5em;
    cursor: pointer; 
    color: #888; 
    transition: color 0.2s ease; 
} */

/* .close-button:hover {
    color: #333; 
} */

/* Layout principal del formulario: utiliza CSS Grid para 2 columnas (CV y campos) */
.referral-form-grid {
  display: grid;
  grid-template-columns: 1fr 2fr; /* Columna izquierda (CV) es 1 parte, derecha (campos) es 2 partes */
  gap: 30px; /* Espacio entre las dos columnas principales */
  padding: 25px; /* Espaciado interno general */
  overflow-y: auto; /* Permite scroll vertical si el contenido del formulario es demasiado largo */
}

/* Panel Izquierdo: Área de Carga de CV */
.form-left-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  text-align: center;
  height: fit-content;
}

input::placeholder {
  font-size: 14px;
}
select {
  font-size: 10px;
}

img {
  width: 150px;
}

.cv-upload-area .cloud-icon-container {
  color: #ff7f50;
  font-size: 4em;
  margin-bottom: 15px;
  width: 60px;
  height: 250px;
  justify-content: center;
  align-items: center;
  display: flex;
}
.cloud-icon-container {
  margin-left: 90px;
  position: relative;
  top: 100px;
  left: -6px;
}
.h22 {
  font-size: 5px;
}
.flechass {
  transform: rotate(290deg);
  width: 30px;
}

.cv-upload-area h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 18px;
}

.cv-upload-area p {
  font-size: 0.9em;
  color: #666;
  line-height: 1.5;
}
.flecha-titulo {
  display: flex;
  margin-top: 20px;
  gap: 15px;
}
.cv-upload-area .click-here-label {
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}

/* Panel Derecho: Contenedor de los campos del formulario */
.form-right-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Fila de campos: utiliza flexbox para organizar los campos horizontalmente */
.form-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

/* Ajuste de ancho para los campos dentro de una fila (ocupan la mitad del ancho disponible) */
.form-row .outlined-input-container {
  flex: 1 1 calc(50% - 7.5px);
  min-width: 150px;
}

/* Campo que ocupa todo el ancho de la fila (ej. Email) */
.form-row .full-width {
  flex: 1 1 100%;
}

/* Ajustes específicos para la sección de código de país y teléfono */
.form-row.phone-section .country-code-select {
  flex: 0 0 200px;
  min-width: unset;
}

.form-row.phone-section .phone-input {
  flex: 1;
  min-width: 130px;
}

/* Sección de radio buttons "Previous work experience?" */
.previous-work-experience-section {
  margin-top: 5px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.previous-work-experience-section p {
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-group input[type="radio"] {
  margin-right: 5px;
}

/* Títulos de sección (ej. "Other Details") */
.section-title {
  margin-top: 5px;
  margin-bottom: 15px;
  font-size: 1.2em;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

/* Pie del formulario con botones de acción */
.form-footer {
  display: flex;
  justify-content: flex-start;
  padding: 20px 25px;
  border-top: 1px solid #eee;
  width: fit-content;
  background-color: #fbfbfb;
}
.form-footer2 {
  display: flex;
  justify-content: flex-end;
  margin-left: 380px;
  padding: 20px 25px;
  border-top: 1px solid #eee;
  width: fit-content;
  background-color: #fbfbfb;
}

/* --- Estilos para los Campos Delineados (Outlined Inputs) --- */

.outlined-input-container {
  position: relative;
  height: 60px;
  border-radius: 4px;
  box-sizing: border-box;
  margin-bottom: 5px;
}

/* Estilos base para input, textarea y select */
.outlined-input-container input,
.outlined-input-container textarea,
.outlined-input-container select {
  width: 100%;
  height: 100%;
  padding: 16px 12px 0;
  border: none;
  background-color: transparent;
  font-size: 1em;
  color: #666;
  box-sizing: border-box;
  outline: none;
  position: relative;
  z-index: 1;
  resize: vertical;

  font-size: 14px;
  top: 4px;
}
.country {
  margin-top: -30px;
}
/* CustomTextareaStyles.css */

/* --- Contenedor Principal: .comments-textarea-wrapper --- */
/* Ahora, todas las reglas que sigan se aplicarán SÓLO a este campo de comentarios */
.comments-textarea-wrapper {
  position: relative; /* Crucial para posicionar el fieldset */
  margin-bottom: 20px;
  width: 100%;
  min-height: 150px; /* ¡Ajusta esta altura mínima según lo necesites! */
}

/* --- Estilos del Textarea en sí (textarea#coments) --- */
textarea#coments {
  width: 100%;
  height: 100%; /* Ocupa la altura de su contenedor padre */
  padding: 26px 17px 10px 20px;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #333;
  outline: none;
  box-sizing: border-box;
  resize: vertical;
  overflow-y: auto;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
}

/* --- Estilos del Fieldset: .input-outline dentro de .comments-textarea-wrapper --- */
.comments-textarea-wrapper .input-outline {
  /* ¡Selector más específico! */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 0 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  pointer-events: none;
  overflow: hidden;
  transition: border-color 0.2s ease-out, border-width 0.2s ease-out;
  z-index: 0;
}

/* --- Estilos de la Leyenda: .input-legend dentro de .comments-textarea-wrapper --- */
.comments-textarea-wrapper .input-legend {
  /* ¡Selector más específico! */
  display: inline-block;
  padding: 0px;
  font-size: 25px;
  color: #333;
  background-color: white;
  margin-left: -8px;
  line-height: 1;
  transition: color 0.3s ease-in-out;
}

/* --- Estilos al Enfocar (Focus State) --- */
/* Cuando el contenedor específico está enfocado */
.comments-textarea-wrapper:focus-within .input-outline {
  /* ¡Selector más específico! */
  border-color: rgb(220, 112, 56);
  border-width: 2px;
}

/* Leyenda naranja al enfocar en el contenedor específico */
.comments-textarea-wrapper:focus-within .input-legend {
  /* ¡Selector más específico! */
  color: rgb(220, 112, 56);
}

/* --- Estilos del Placeholder (siguen siendo específicos por ID del textarea) --- */
textarea#coments::placeholder {
  color: #666;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
  font-size: 13px;
}

textarea#coments:focus::placeholder {
  opacity: 0;
}

textarea#coments:not(:placeholder-shown)::placeholder {
  opacity: 0;
}

/* Estilos específicos para la flecha del select */
.outlined-input-container.select-variant select {
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 30px;
}

/* Estilos para la etiqueta flotante ESTÁTICA */
.outlined-input-container label {
  position: absolute;
  top: 8px;
  left: 10px;
  font-size: 0.75em;
  color: #000;
  background-color: #fff;
  padding: 0 4px;
  pointer-events: none;
  transition: color 0.2s ease-out;
  z-index: 2;
}

/* Estilos para el borde delineado (fieldset) */
.input-outline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  transition: border-color 0.2s ease-out, border-width 0.2s ease-out;
  z-index: 0;
}

/* Estilos para el recorte del borde (legend) ESTÁTICO */
.input-legend {
  float: unset;
  width: auto;
  max-width: 100%;
  padding: 0;
  height: auto;
  overflow: visible;
  visibility: visible;
  transition: none;
  white-space: nowrap;
}

.input-legend span {
  font-size: 0.55em;
  padding: 0 4px;
  visibility: inherit;
  display: inline-block;
  margin-top: -5px;
}

/* --- ESTILOS DE ENFOQUE/VALIDACIÓN (Color naranja de ejemplo) --- */

/* Cambiar el color del borde y grosor al enfocar cualquier input/textarea/select */
.outlined-input-container input:focus ~ .input-outline,
.outlined-input-container textarea:focus ~ .input-outline,
.outlined-input-container select:focus ~ .input-outline,
.outlined-input-container select:valid ~ .input-outline {
  border-color: rgb(220, 112, 56);
  border-width: 2px;
}

/* Cambiar el color de la etiqueta al enfocar cualquier input/textarea/select */
.outlined-input-container input:focus ~ label,
.outlined-input-container textarea:focus ~ label,
.outlined-input-container select:focus ~ label,
.outlined-input-container select:valid ~ label {
  color: rgb(220, 112, 56);
}

/* ... (Todo tu CSS existente arriba, y las reglas anteriores de bootstrap-alert-fixed ya no son necesarias si solo usas SweetAlert2) ... */

/* Estilo personalizado para el popup de SweetAlert2 */
.swal2-custom-success-popup {
  background-color: rgb(
    220,
    112,
    56
  ) !important; /* Tu color naranja para el fondo del popup */
  color: white !important; /* Color del texto dentro del popup */
  /* Puedes añadir más estilos si quieres, como border-radius, box-shadow, etc. */
}

/* Opcional: Asegurarte de que el texto dentro del popup sea blanco */
.swal2-custom-success-popup .swal2-title,
.swal2-custom-success-popup .swal2-html-container {
  color: white !important;
}

/* Estilo para el botón de confirmación de SweetAlert2 si no se define inline */
/* Si ya lo defines con confirmButtonColor en el JS, esto no es estrictamente necesario */
.swal2-confirm.swal2-styled {
  background-color: rgb(220, 112, 56) !important;
  border-color: rgb(220, 112, 56) !important;
}

/* Estilos Base para los botones del formulario */
.btn-cancel,
.btn-submit {
  padding: 10px 25px;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  font-weight: 600;
}

/* Referidos.css */

/* Base styles for react-select components */
.react-select__control {
  border-radius: 4px !important; /* Adjust as per your input border-radius */
}

.react-select__control--is-focused {
  border-color: rgb(220, 112, 56) !important;
  box-shadow: 0 0 0 1px rgb(220, 112, 56) !important;
}

.react-select__value-container {
  padding-left: 14px;
  padding-right: 14px;
}

.react-select__placeholder {
  color: #aaa !important;
  padding: 0; /* Override default padding if necessary */
}

/* Adjust legend-like appearance for the placeholder when a value is present */
.react-select__single-value + .react-select__placeholder {
  transform: translateY(-18px) scale(0.75);
  transform-origin: top left;
  background-color: white; /* To simulate the cut-out */
  padding: 0 5px;
  margin-left: -5px;
}

/* Ensure the input-outline fieldset aligns correctly with react-select */
.react-select-container .input-outline {
  pointer-events: none; /* Prevent clicks on the fieldset */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border: 1px solid #ccc;
  border-radius: 4px; /* Match input border-radius */
  overflow: hidden; /* Hide overflow from legend */
  transition: border-color 0.2s ease-out;
}
#p {
  font-size: 12px;
}
.react-select-container .input-outline legend {
  visibility: hidden; /* Hide the default legend text, react-select handles it */
  max-width: 0.01px; /* collapse legend space */
  padding: 0;
}

/* Apply focus styles to the fieldset border for react-select */
.react-select-container .react-select__control--is-focused + .input-outline {
  border-color: rgb(220, 112, 56);
}

/* Specific styling for the textarea variant */
.btn-cancel {
  transition: all 0.3s ease;
  background-color: rgb(48, 192, 209);
  color: #fff;
  border: 2px solid rgb(48, 192, 209);
}

.btn-cancel:hover {
  transform: translateY(-2px);
  background-color: #fff;
  color: rgb(48, 192, 209);
  box-shadow: 0 4px 8px rgb(48, 192, 209);
}

/* Estilos para el botón "Submit" */
.btn-submit {
  transition: all 0.3s ease;
  background-color: rgb(220, 112, 56);
  color: white;
  border: 2px solid rgb(220, 112, 56);
}

.btn-submit:hover {
  transform: translateY(-2px);
  color: rgb(220, 112, 56);
  border: solid 2px rgb(220, 112, 56);
  background-color: transparent;
  box-shadow: 0 4px 8px rgb(220, 112, 56);
}

.select-variant.country-code-select {
  position: relative;
  flex-grow: 1; /* Permite que ocupe espacio si está en un flex container */
}

.select-variant.country-code-select .custom-dropdown-menu {
  list-style: none; /* Elimina los puntos de la lista */
  padding: 0;
  margin: 0;
  position: absolute; /* Posiciona el menú sobre otros elementos */
  top: 100%; /* Coloca el menú justo debajo del input */
  left: 0;
  width: 100%;
  max-height: 200px; /* Limita la altura y añade scroll si hay muchas opciones */
  overflow-y: auto;
  border: 1px solid #ccc;
  border-top: none; /* Estéticamente, para que no se vea doble borde */
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra para darle profundidad */
  z-index: 1000; /* Asegura que esté por encima de otros elementos */
  border-radius: 0 0 4px 4px;
}

.select-variant.country-code-select.is-open::after {
  transform: translateY(-50%) rotate(180deg);
}
.select-variant.country-code-select .custom-dropdown-item {
  padding: 10px;
  cursor: pointer;
  white-space: nowrap; /* Evita que el texto se rompa */
  overflow: hidden;
  text-overflow: ellipsis; /* Añade puntos suspensivos si el texto es muy largo */
}
.select-variant.country-code-select .custom-dropdown-item:hover {
  background-color: #f0f0f0;
}
.select-variant.country-code-select::after {
  content: "▼"; /* La flecha por defecto apunta hacia abajo */
  position: absolute;
  right: 15px; /* Ajusta la posición a la derecha */
  top: 50%;
  transform: translateY(-50%); /* Centra verticalmente */
  pointer-events: none; /* Asegura que el clic pase a través del ícono al input */
  color: #888; /* Color de la flecha */
  font-size: 0.8em; /* Tamaño de la flecha */
  transition: transform 0.3s ease; /* Transición suave para la rotación */
}

/* Nueva regla: Rota la flecha cuando el contenedor tiene la clase 'is-open' */
.select-variant.country-code-select.is-open::after {
  transform: translateY(-50%) rotate(180deg);
}
.select-variant.country-code-select::after {
  /* ... otras propiedades ... */
  transition: transform 0.3s ease; /* ¡Esta es crucial! */
}

@media (max-width: 768px) {
  /* El grid de 2 columnas se convierte en 1 columna en pantallas pequeñas */
  .referral-form-grid {
    grid-template-columns: 1fr;
    padding: 15px; /* Reduce el padding general */
  }

  /* El modal se ajusta mejor al ancho en pantallas pequeñas */
  .form-modal-content {
    width: 95%;
  }

  /* Los campos dentro de las filas ocupan todo el ancho disponible */
  .form-row .outlined-input-container {
    flex: 1 1 100%;
    min-width: unset; /* Anula el min-width para que puedan encogerse más */
  }

  .form-row.phone-section .country-code-select {
    flex: 0 0 100px;
  }

  .form-row.phone-section .phone-input {
    flex: 1;
  }

  .button-collection button {
    width: 100%;
  }
}

