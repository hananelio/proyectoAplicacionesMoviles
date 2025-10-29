import { Encuesta } from '../../models/encuesta.model';
import { DateTime } from 'luxon';
import { Pregunta } from 'src/app/models/pregunta.model';
import { Usuario } from 'src/app/models/usuario.model';

export class FirestoreMapear {

    /** Convierte fecha (string o Date) a formato ISO yyyy-MM-dd */
    static toDateString(date?: string | Date): string | undefined {
        if (!date) return undefined;
        const d = new Date(date);
        // Normaliza a formato YYYY-MM-DD (sin hora)
        return d.toISOString().split('T')[0];
    }
/** Convierte string (YYYY-MM-DD o Date) a ISO con hora (para Firestore) */
    static toTimestamp(dateStr?: string | Date): string | undefined {
        if (!dateStr) return undefined;
        return new Date(dateStr).toISOString(); // ejemplo: "2025-10-23T18:12:00.000Z"
    }
    /** Convierte timestamp Firestore a ISO (con hora) */
    static fromTimestamp(timestamp?: string): string {
        return timestamp ?? '';
    }
    /** Convierte timestamp Firestore a solo fecha (YYYY-MM-DD) */
    static fromTimestampDateOnly(timestamp?: string): string {
        return timestamp ? timestamp.split('T')[0] : '';
    }
    /** Emvía los datos de la Encuesta a Firestore */
    static encuestaToFirestore(e : Encuesta) {
        //const toTimestamp = (d : any) => new Date(d).toISOString();
        const fields : any = {
            titulo : { stringValue : e.titulo },
            creadorId : { stringValue : e.creadorId },
            estado : { stringValue : e.estado },
            descripcion : { stringValue : e.descripcion ?? '' },
        };

        if (e.fechaCreacion) fields.fechaCreacion = { timestampValue: this.toTimestamp(e.fechaCreacion) };
        if (e.fechaActualizacion) fields.fechaActualizacion = { timestampValue: this.toTimestamp(e.fechaActualizacion) };
        if (e.fechaPublicacion) fields.fechaPublicacion = { timestampValue: this.toTimestamp(e.fechaPublicacion) };
        if (e.fechaCierre) fields.fechaCierre = { timestampValue: this.toTimestamp(e.fechaCierre) };

        return { fields };
    }
    /** Recibe los datos de la Encuesta de Firestore */
    static encuestaFromFirestore(doc: any): Encuesta {
        const f = doc.fields ?? {};
        return {
            id: doc.name?.split('/').pop() ?? '',
            titulo: f.titulo?.stringValue ?? '',
            descripcion: f.descripcion?.stringValue ?? '',
            creadorId: f.creadorId?.stringValue ?? '',
            estado: f.estado?.stringValue ?? 'borrador',
            fechaCreacion: this.fromTimestamp(f.fechaCreacion?.timestampValue) ?? '',
            fechaActualizacion: this.fromTimestamp(f.fechaActualizacion?.timestampValue) ?? '',
            fechaPublicacion: this.fromTimestamp(f.fechaPublicacion?.timestampValue) ?? '',
            fechaCierre: this.fromTimestamp(f.fechaCierre?.timestampValue) ?? '',
            
            preguntas: [], // se llenará si haces otra petición a subcolección
            asignaciones: [],
        }
    }
    /** Envía los datos del Usuario a Firestore */
    static usuarioToFirestore(u: Usuario) {
        const fields: any = {
            uid: { stringValue: u.uid }, // <--- agrega esta línea
            ci: { stringValue: u.ci },
            extension: { stringValue: u.extension ?? 'Sc' },
            firstName: { stringValue: u.firstName },
            lastName: { stringValue: u.lastName },
            sexo: { stringValue: u.sexo },
            telefono: { stringValue: u.telefono },
            email: { stringValue: u.email },
            username: { stringValue: u.username },
            rol: { stringValue: u.rol ?? 'encuestador' },
            estado: { stringValue: u.estado ?? 'activo' },
        }
        
        if (u.complemento) fields.complemento = { stringValue: u.complemento };
        //if (u.password) fields.password = { stringValue: u.password };
        if (u.fechaNacimiento)
            fields.fechaNacimiento = { timestampValue: this.toTimestamp(u.fechaNacimiento) };
        if (u.fechaCreacion) fields.fechaCreacion = { timestampValue: this.toTimestamp(u.fechaCreacion) };
        /*if (u.fechaNacimiento)
            fields.fechaNacimiento = { timestampValue: new Date(u.fechaNacimiento).toISOString() };*/
        //if (u.fechaNacimiento) fields.fechaNacimiento = { timestampValue: u.fechaNacimiento };

        return { fields };
    }
    /** Recibe los datos del Usuario de Firestore */
    static usuarioFromFirestore(doc:any): Usuario {
        const f = doc.fields ?? {};

        return {
            uid: f.uid?.stringValue ?? '',
            id: doc.name?.split('/').pop() ?? '',
            ci: f.ci?.stringValue ?? '',
            complemento: f.complemento?.stringValue ?? '',
            extension: f.extension?.stringValue as Usuario['extension'],
            //extension: f.extension?.stringValue ?? '',
            firstName: f.firstName?.stringValue ?? '',
            lastName: f.lastName?.stringValue ?? '',
            sexo: f.sexo?.stringValue ?? '',
            telefono: f.telefono?.stringValue ?? '',
            fechaNacimiento: this.fromTimestampDateOnly(f.fechaNacimiento?.timestampValue),
            fechaCreacion: this.fromTimestamp(f.fechaCreacion?.timestampValue),
            //fechaNacimiento: f.fechaNacimiento?.timestampValue ?? '',
            /*fechaNacimiento: f.fechaNacimiento?.timestampValue
                ? f.fechaNacimiento.timestampValue.split('T')[0]
                : '',*/
            email: f.email?.stringValue ?? '',
            username: f.username?.stringValue ?? '',
            password: f.password?.stringValue,
            rol: f.rol?.stringValue ?? 'encuestador',
            estado: f.estado?.stringValue ?? 'activo',
        }
    }
    /**Envía los datos de la Pregunta a Firestore */
    static preguntaToFirestore(p: Pregunta) {
        const fields: any = {
            idEncuesta: { stringValue: p.idEncuesta },
            texto: { stringValue: p.texto },
            seccion: { stringValue: p.seccion ?? '' },
            tipo: { stringValue: p.tipo },
            orden: { integerValue: p.orden }
        };

        if (p.obligatorio !== undefined)
            fields.obligatorio = { booleanValue: p.obligatorio };
        // Opciones posibles
        fields.opciones = {
            arrayValue: {
                values: p.opciones.map(op => {
                const fieldsOpcion: any = {
                    valor: { stringValue: op.valor }
                };
                if (op.esOtro !== undefined) {
                    fieldsOpcion.esOtro = { booleanValue: op.esOtro };
                }
                return { mapValue: { fields: fieldsOpcion } };
                })
            }
        };

        
        // Escala
        if (p.valorMin !== undefined)
            fields.valorMin = { integerValue: p.valorMin.toString() }; //String(p.valorMin)
        if (p.valorMax !== undefined)
            fields.valorMax = { integerValue: p.valorMax.toString() }; //String(p.valorMax)
        if (p.etiquetaInicio) fields.etiquetaInicio = { stringValue: p.etiquetaInicio };
        if (p.etiquetaFin) fields.etiquetaFin = { stringValue: p.etiquetaFin };

        return { fields };
    }
    /**Recibe los datos del Usuario de Firestore */
    static preguntaFromFirestore (doc: any): Pregunta {
        const f = doc.fields ?? {};
        return {
            id: doc.name?.split('/').pop(),
            idEncuesta: f.idEncuesta.stringValue,
            texto: f.texto?.stringValue,
            seccion: f.seccion?.stringValue,
            tipo: f.tipo?.stringValue,
            opciones: f.opciones?.arrayValue?.values?.map((v: any) => ({
                valor: v.mapValue.fields.valor.stringValue,
                esOtro: v.mapValue.fields.esOtro?.booleanValue
            })) ?? [],
            obligatorio: f.obligatorio?.booleanValue,
            orden: f.orden?.integerValue,

            // 🔹 Agregar lectura de etiquetas
            valorMin: f.valorMin
                ? Number(f.valorMin.integerValue ?? f.valorMin.stringValue)//(f.valorMin.integerValue)
                : undefined,
            valorMax: f.valorMax
                ? Number(f.valorMax.integerValue ?? f.valorMax.stringValue)//(f.valorMax.integerValue)
                : undefined,
            etiquetaInicio: f.etiquetaInicio?.stringValue ?? '',
            etiquetaFin: f.etiquetaFin?.stringValue ?? '',

            // Inicializar respuestas vacías para checkbox / opción múltiple
            respuestas: [] // se llenará desde la subcolección "Respuesta"
            
        }
    }
}
