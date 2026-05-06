import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Users, UserPlus, AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react";
import { listarUsuarios, registrarUsuario, type Usuario } from "../services/apiService";

export function UsersPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const cargarUsuarios = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listarUsuarios();
      setUsuarios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleRegistrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cleanNombre = nombre.trim();
    const cleanApellido = apellido.trim();
    const cleanEmail = email.trim();

    if (!cleanNombre || !cleanApellido) {
      setError("Nombre y apellido son obligatorios");
      return;
    }

    if (!cleanEmail.includes("@")) {
      setError("Correo inválido");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setSubmitting(true);

    try {
      const nuevoUsuario = await registrarUsuario(
        cleanEmail,
        cleanNombre,
        cleanApellido,
        password
      );

      // 🔥 Mejor que recargar todo
      setUsuarios((prev) => [...prev, nuevoUsuario]);

      setSuccess(`Usuario ${cleanNombre} registrado exitosamente`);

      // limpiar form
      setNombre("");
      setApellido("");
      setEmail("");
      setPassword("");
      setShowForm(false);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar usuario");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setError("");
    setSuccess("");
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Administrar Usuarios
          </h2>
        </div>

        <Button onClick={toggleForm}>
          <UserPlus className="w-4 h-4 mr-2" />
          {showForm ? "Cancelar" : "Nuevo Usuario"}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Registrar Nuevo Usuario</CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleRegistrar}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >

              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
                disabled={submitting}
                required
              />

              <Input
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Apellido"
                disabled={submitting}
                required
              />

              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                disabled={submitting}
                required
              />

              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                disabled={submitting}
                required
              />

              <div className="md:col-span-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <LoaderCircle className="w-4 h-4 animate-spin mr-2" />
                      Registrando...
                    </>
                  ) : (
                    "Registrar Usuario"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle>
            Usuarios Registrados ({usuarios.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoaderCircle className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="text-center py-6">
              <p className="text-red-500 mb-3">{error}</p>
              <Button onClick={cargarUsuarios}>Reintentar</Button>
            </div>
          ) : usuarios.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay usuarios registrados
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Nombre</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Estado</th>
                  <th className="p-3 text-left">Registro</th>
                </tr>
              </thead>

              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{u.id}</td>
                    <td className="p-3 font-medium">
                      {u.nombre} {u.apellido}
                    </td>
                    <td className="p-3 text-gray-600">{u.email}</td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          u.autenticado
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {u.autenticado ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    <td className="p-3 text-gray-500">
                      {u.fechaRegistro
                        ? new Date(u.fechaRegistro).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
