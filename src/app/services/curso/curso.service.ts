import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { Configurl} from '../config'
@Injectable({
  providedIn: 'root'
})
export class CursoService {
  url=Configurl.url
  urlInsert=this.url+"usuarios"
  urlSelect=this.url+"usuarios/select"
  urlUpdate=this.url+"usuarios/modificar"
  urlDelete=this.url+"usuarios/eliminar"
  headers= new HttpHeaders({
    'Content-Type':  'application/json',
    'X-CSRF-TOKEN':"token",
    'Authorization':"token"
  })

  constructor(private http:HttpClient) { }

     //tipo ejercicios
     crearcurso(datos,fecha,hora,semanas){
      let sql="INSERT into cursos (titulo,descripcion,costo,tipomoneda,fecha,hora,semanas) VALUES (?,?,?,?,?,?,?)"
      let values=[datos.titulo,datos.descripcion,datos.costo,datos.moneda,fecha,hora,semanas]
      return this.http.post<any>(this.urlInsert,{sql:sql,values:values},{headers:this.headers})
      .toPromise()
    }
    crearUsu_cur(idusu,idcurso,tipo){
      let sql="INSERT into usu_cur (id_curso,id_usuario,tipo) VALUES (?,?,?)"
      let values=[idcurso,idusu,tipo]
      return this.http.post<any>(this.urlInsert,{sql:sql,values:values},{headers:this.headers})
      .toPromise()
    }
    crearImagenCurso(idcurso: string, datos: { nombre: string, url: string,thumb:string }) {
      let sql = "INSERT into  fotos_curso (nombre,url,id_curso,thumb) VALUES (?,?,?,?)"
      let values = [datos.nombre, datos.url, idcurso,datos.thumb]
      return this.http.post<any>(this.urlInsert, { sql: sql, values: values }, { headers: this.headers })
        .toPromise()
    }

    //listar cursos
    listarcursos(estado){
      let sql="select c.*,u.idusuarios, u.fullname, u.foto, u.telefono from cursos c,usu_cur uc,usuarios u where c.estado=? and u.idusuarios=uc.id_usuario and uc.id_curso=c.idcursos and uc.tipo=0 order by c.fecha desc limit 3" 
      let values=[estado]
      return this.http.post<any>(this.urlSelect,{sql:sql,values:values},{headers:this.headers})
    }
    listarfotos(idcurso){
      let sql="select * from fotos_curso where id_curso=?" 
      let values=[idcurso]
      return this.http.post<[]>(this.urlSelect,{sql:sql,values:values},{headers:this.headers}).toPromise()
    }

      //listar cursos
    miscursospublicados(estado,idusu){
      let sql="select c.*,u.idusuarios, u.fullname, u.foto, u.telefono from cursos c,usu_cur uc,usuarios u where c.estado=? and uc.id_usuario=? and u.idusuarios=uc.id_usuario and uc.id_curso=c.idcursos and uc.tipo=0 order by c.fecha desc limit 3"
      let values=[estado,idusu]
      return this.http.post<any>(this.urlSelect,{sql:sql,values:values},{headers:this.headers})
    }

    //listar cursos
    buscarCurso(query){
      let sql="select c.*,u.idusuarios, u.fullname, u.foto, u.telefono from cursos c,usu_cur uc,usuarios u where  u.idusuarios=uc.id_usuario and uc.id_curso=c.idcursos and uc.tipo=0 and c.idcursos IN(SELECT cc.idcursos FROM cursos cc WHERE cc.estado=1  cc.titulo like '%?%' OR cc.descripcion like '%?%')"
      let values=[query]
      return this.http.post<[]>(this.urlSelect,{sql:sql,values:values},{headers:this.headers})
    }
    listarMisAlumnos(idusu){
      let sql=`
      SELECT * 
      from usuarios u, usu_cur uc 
      WHERE u.idusuarios=uc.id_usuario and uc.tipo='i' and 
      uc.id_curso in (
        SELECT uc2.id_curso 
        from usu_cur uc2,usuarios u2 
        where u2.idusuarios=uc2.id_usuario and uc2.tipo='c' and u2.idusuarios=?
        )`
      let values=[idusu]
      return this.http.post<[]>(this.urlSelect,{sql:sql,values:values},{headers:this.headers}).toPromise()
    }
}
