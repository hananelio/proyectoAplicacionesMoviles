import { Encuesta } from '../../models/encuesta.model'

export class FirestoreMapear {
    static encuestaToFirestore(e : Encuesta) {
        //const toTimestamp = (d : any) => new Date(d).toISOString();
        const fields : any = {
            titulo : { stringValue : e.titulo },
            //descripcion : { stringValue : e.descripcion },
            creadorId : { stringValue : e.creadorId },
            estado : { stringValue : e.estado },
        };

        if (e.descripcion) fields.descripcion = {stringValue : e.descripcion};
        if (e.fechaCreacion) fields.fechaCreacion = { timestampValue : e.fechaCreacion };
        if (e.fechaActualizacion) fields.fechaActualizacion = { timestampValue : e.fechaActualizacion };
        if (e.fechaPublicacion) fields.fechaPublicacion = { timestampValue : e.fechaPublicacion };
        if (e.fechaCierre) fields.fechaCierre = { timestampValue : e.fechaCierre };

        return { fields };
    }

    static encuestaFromFirestore(doc: any): Encuesta {
        const f = doc.fields ?? {};
        return {
            id: doc.name?.split('/').pop(),
            titulo: f.titulo?.stringValue ?? '',
            descripcion: f.descripcion?.stringValue ?? '',
            creadorId: f.creadorId?.stringValue ?? '',
            estado: f.estado?.stringValue ?? 'borrador',
            //fechaCreacion: f.fechaCreacion?.timestampValue ?? undefined,
            fechaCreacion: f.fechaCreacion?.timestampValue,
            fechaActualizacion: f.fechaActualizacion?.timestampValue,
            fechaPublicacion: f.fechaPublicacion?.timestampValue,
            fechaCierre: f.fechaCierre?.timestampValue,
            secciones: [], // se llenará si haces otra petición a subcolección
            asignaciones: [],
        }
    }
}
