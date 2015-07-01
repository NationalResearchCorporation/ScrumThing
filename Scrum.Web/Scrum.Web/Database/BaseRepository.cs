using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;
using System.Web;
using System.Xml.Linq;

namespace Scrum.Web.Database {
    /// <summary>
    /// Used to specify the schema for a stored procedure
    /// Add this tag to each method in the repository
    /// </summary>
    [AttributeUsage(AttributeTargets.Method)]
    public class SchemaAttribute : Attribute {

        public string Schema { get; private set; }

        public SchemaAttribute(string schema) {
            this.Schema = schema;
        }
    }

    /// <summary>
    /// Contains methods common to all repositories
    /// </summary>
    public class BaseRepository {
        private string connectionString;

        /// <summary>
        /// One parameter constructor allows you to supply a connection string directly
        /// </summary>
        /// <param name="connectionString">The connection string</param>
        public BaseRepository(string connectionString) {
            this.connectionString = connectionString;
        }

        /// <summary>
        /// Runs a stored procedure
        /// </summary>
        /// <param name="sprocInput">Values passed as parameters to the stored procedure.  The order must be the same as they are listed in the signiture of the calling method.</param>
        /// <param name="memberName">Populated automatically via .NET reflection.  This is the name of the calling method.</param>
        /// <returns>The return value of the stroed procedure as an object.</returns>
        protected object RunSproc(object[] sprocInput, [CallerMemberName] string memberName = "") {
            var method = this.GetType().GetMethod(memberName);
            var attributes = method.GetCustomAttributes(typeof(SchemaAttribute), true);

            SqlParameter retVal = new SqlParameter();
            retVal.Direction = ParameterDirection.ReturnValue;

            SqlCommand cmd = buildCommand(method.Name, ((SchemaAttribute)attributes[0]).Schema, method.GetParameters(), sprocInput);
            cmd.Parameters.Add(retVal);

            using (SqlConnection conn = new SqlConnection(this.connectionString)) {
                conn.Open();
                cmd.Connection = conn;
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.ExecuteNonQuery();
                return retVal.Value;
            }
        }

        /// <summary>
        /// Runs a stored procedure
        /// </summary>
        /// <typeparam name="T1">An entity class that represents a row in the first result set.  Property names must match column names.</typeparam>
        /// <param name="sprocInput">Values passed as parameters to the stored procedure.  The order must be the same as they are listed in the signiture of the calling method.</param>
        /// <param name="memberName">Populated automatically via .NET reflection.  This is the name of the calling method.</param>
        /// <returns>A tuple containing two lists, one of type T1 and the other of type T2</returns>
        protected List<T1> RunSproc<T1>(object[] sprocInput, [CallerMemberName] string memberName = "")
            where T1 : new() {
            return RunSprocHelper(sprocInput, memberName,
                (ds) => ConvertDataRow<T1>(ds.Tables[0].CreateDataReader()));
        }

        /// <summary>
        /// Runs a stored procedure
        /// </summary>
        /// <typeparam name="T1">An entity class that represents a row in the first result set.  Property names must match column names.</typeparam>
        /// <typeparam name="T2">An entity class that represents a row in the second result set.  Property names must match column names.</typeparam>
        /// <param name="sprocInput">Values passed as parameters to the stored procedure.  The order must be the same as they are listed in the signiture of the calling method.</param>
        /// <param name="memberName">Populated automatically via .NET reflection.  This is the name of the calling method.</param>
        /// <returns>A tuple containing two lists, one of type T1 and the other of type T2</returns>
        protected Tuple<List<T1>, List<T2>> RunSproc<T1, T2>(object[] sprocInput, [CallerMemberName] string memberName = "")
            where T1 : new()
            where T2 : new() {
            return RunSprocHelper(sprocInput, memberName,
                (ds) => Tuple.Create(
                    ConvertDataRow<T1>(ds.Tables[0].CreateDataReader()),
                    ConvertDataRow<T2>(ds.Tables[1].CreateDataReader())
                ));
        }

        /// <summary>
        /// Runs a stored procedure
        /// </summary>
        /// <typeparam name="T1">An entity class that represents a row in the first result set.  Property names must match column names.</typeparam>
        /// <typeparam name="T2">An entity class that represents a row in the second result set.  Property names must match column names.</typeparam>
        /// <typeparam name="T3">An entity class that represents a row in the third result set.  Property names must match column names.</typeparam>
        /// <param name="sprocInput">Values passed as parameters to the stored procedure.  The order must be the same as they are listed in the signiture of the calling method.</param>
        /// <param name="memberName">Populated automatically via .NET reflection.  This is the name of the calling method.</param>
        /// <returns>A tuple containing two lists, one of type T1 and the other of type T2</returns>
        protected Tuple<List<T1>, List<T2>, List<T3>> RunSproc<T1, T2, T3>(object[] sprocInput, [CallerMemberName] string memberName = "")
            where T1 : new()
            where T2 : new()
            where T3 : new() {
            return RunSprocHelper(sprocInput, memberName,
                (ds) => Tuple.Create(
                    ConvertDataRow<T1>(ds.Tables[0].CreateDataReader()),
                    ConvertDataRow<T2>(ds.Tables[1].CreateDataReader()),
                    ConvertDataRow<T3>(ds.Tables[2].CreateDataReader())
                ));
        }

        /// <summary>
        /// Runs a stored procedure
        /// </summary>
        /// <typeparam name="T1">An entity class that represents a row in the first result set.  Property names must match column names.</typeparam>
        /// <typeparam name="T2">An entity class that represents a row in the second result set.  Property names must match column names.</typeparam>
        /// <typeparam name="T3">An entity class that represents a row in the third result set.  Property names must match column names.</typeparam>
        /// <typeparam name="T4">An entity class that represents a row in the fourth result set.  Property names must match column names.</typeparam>
        /// <param name="sprocInput">Values passed as parameters to the stored procedure.  The order must be the same as they are listed in the signiture of the calling method.</param>
        /// <param name="memberName">Populated automatically via .NET reflection.  This is the name of the calling method.</param>
        /// <returns>A tuple containing two lists, one of type T1 and the other of type T2</returns>
        protected Tuple<List<T1>, List<T2>, List<T3>, List<T4>> RunSproc<T1, T2, T3, T4>(object[] sprocInput, [CallerMemberName] string memberName = "")
            where T1 : new()
            where T2 : new()
            where T3 : new()
            where T4 : new() {
            return RunSprocHelper(sprocInput, memberName,
                (ds) => Tuple.Create(
                    ConvertDataRow<T1>(ds.Tables[0].CreateDataReader()),
                    ConvertDataRow<T2>(ds.Tables[1].CreateDataReader()),
                    ConvertDataRow<T3>(ds.Tables[2].CreateDataReader()),
                    ConvertDataRow<T4>(ds.Tables[3].CreateDataReader())
                ));
        }

        /// <summary>
        /// Runs a stored procedure
        /// </summary>
        /// <typeparam name="T1">An entity class that represents a row in the first result set.  Property names must match column names.</typeparam>
        /// <typeparam name="T2">An entity class that represents a row in the second result set.  Property names must match column names.</typeparam>
        /// <typeparam name="T3">An entity class that represents a row in the third result set.  Property names must match column names.</typeparam>
        /// <typeparam name="T4">An entity class that represents a row in the fourth result set.  Property names must match column names.</typeparam>
        /// <typeparam name="T5">An entity class that represents a row in the fifth result set.  Property names must match column names.</typeparam>
        /// <param name="sprocInput">Values passed as parameters to the stored procedure.  The order must be the same as they are listed in the signiture of the calling method.</param>
        /// <param name="memberName">Populated automatically via .NET reflection.  This is the name of the calling method.</param>
        /// <returns>A tuple containing two lists, one of type T1 and the other of type T2</returns>
        protected Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>> RunSproc<T1, T2, T3, T4, T5>(object[] sprocInput, [CallerMemberName] string memberName = "")
            where T1 : new()
            where T2 : new()
            where T3 : new()
            where T4 : new()
            where T5 : new() {
            return RunSprocHelper(sprocInput, memberName,
                (ds) => Tuple.Create(
                    ConvertDataRow<T1>(ds.Tables[0].CreateDataReader()),
                    ConvertDataRow<T2>(ds.Tables[1].CreateDataReader()),
                    ConvertDataRow<T3>(ds.Tables[2].CreateDataReader()),
                    ConvertDataRow<T4>(ds.Tables[3].CreateDataReader()),
                    ConvertDataRow<T5>(ds.Tables[4].CreateDataReader())
                ));
        }

        /// <summary>
        /// Runs a stored procedure
        /// </summary>
        /// <typeparam name="T1">An entity class that represents a row in the first result set.  Property names must match column names.</typeparam>
        /// <typeparam name="T2">An entity class that represents a row in the second result set.  Property names must match column names.</typeparam>
        /// <typeparam name="T3">An entity class that represents a row in the third result set.  Property names must match column names.</typeparam>
        /// <typeparam name="T4">An entity class that represents a row in the fourth result set.  Property names must match column names.</typeparam>
        /// <typeparam name="T5">An entity class that represents a row in the fifth result set.  Property names must match column names.</typeparam>
        /// <typeparam name="T6">An entity class that represents a row in the sixth result set.  Property names must match column names.</typeparam>
        /// <param name="sprocInput">Values passed as parameters to the stored procedure.  The order must be the same as they are listed in the signiture of the calling method.</param>
        /// <param name="memberName">Populated automatically via .NET reflection.  This is the name of the calling method.</param>
        /// <returns>A tuple containing two lists, one of type T1 and the other of type T2</returns>
        protected Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>> RunSproc<T1, T2, T3, T4, T5, T6>(object[] sprocInput, [CallerMemberName] string memberName = "")
            where T1 : new()
            where T2 : new()
            where T3 : new()
            where T4 : new()
            where T5 : new()
            where T6 : new() {
            return RunSprocHelper(sprocInput, memberName,
                (ds) => Tuple.Create(
                    ConvertDataRow<T1>(ds.Tables[0].CreateDataReader()),
                    ConvertDataRow<T2>(ds.Tables[1].CreateDataReader()),
                    ConvertDataRow<T3>(ds.Tables[2].CreateDataReader()),
                    ConvertDataRow<T4>(ds.Tables[3].CreateDataReader()),
                    ConvertDataRow<T5>(ds.Tables[4].CreateDataReader()),
                    ConvertDataRow<T6>(ds.Tables[5].CreateDataReader())
                ));
        }

        private T RunSprocHelper<T>(object[] sprocInput, string memberName, Func<DataSet, T> processDataSet) {
            var method = this.GetType().GetMethod(memberName);
            var attributes = method.GetCustomAttributes(typeof(SchemaAttribute), true);

            SqlCommand cmd = buildCommand(method.Name, ((SchemaAttribute)attributes[0]).Schema, method.GetParameters(), sprocInput);

            using (SqlConnection conn = new SqlConnection(this.connectionString)) {
                cmd.Connection = conn;
                SqlDataAdapter adapter = new SqlDataAdapter();
                DataSet ds = new DataSet();
                adapter.SelectCommand = cmd;

                adapter.Fill(ds);
                return processDataSet(ds);
            }
        }

        /// <summary>
        /// Builds a SqlCommand object for a stored procedure
        /// </summary>
        /// <param name="sprocName">The name of the stored procudure to be executed</param>
        /// <param name="schemaName">The schema that the stored procedure belongs to</param>
        /// <param name="parameterMetaData">Info on stored procedure parameter is based on this array of ParameterInfo objects.  The objects represent the parameters of the method from the repository that is calling "RunSroc".</param>
        /// <param name="parameterValues">An array of objects that are values of the input parameters of the stored procedure</param>
        /// <returns></returns>
        private SqlCommand buildCommand(string sprocName, string schemaName, ParameterInfo[] parameterMetaData, object[] parameterValues) {
            parameterMetaData = parameterMetaData.OrderBy(p => p.Position).ToArray();

            SqlCommand cmd = new SqlCommand();
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = string.Format("{0}.{1}", schemaName, sprocName);

            for (int i = 0; i < parameterMetaData.Length; i++) {
                if (parameterMetaData[i].ParameterType == typeof(XElement)) {
                    parameterValues[i] = new SqlXml(((XElement)parameterValues[i]).CreateReader());
                }
                cmd.Parameters.Add(new SqlParameter(parameterMetaData[i].Name, parameterValues[i] ?? (object)DBNull.Value));
            }

            return cmd;
        }

        public string ParameterValueToSql(SqlParameter sp) {
            switch (sp.SqlDbType) {
                case SqlDbType.Char:
                case SqlDbType.NChar:
                case SqlDbType.NText:
                case SqlDbType.NVarChar:
                case SqlDbType.Text:
                case SqlDbType.Time:
                case SqlDbType.VarChar:
                case SqlDbType.Xml:
                case SqlDbType.Date:
                case SqlDbType.DateTime:
                case SqlDbType.DateTime2:
                case SqlDbType.DateTimeOffset:
                    return "'" + sp.Value.ToString().Replace("'", "''") + "'";
                case SqlDbType.Bit:
                    return (bool)sp.Value ? "1" : "0";
                default:
                    return sp.Value.ToString().Replace("'", "''");
            }
        }

        /// <summary>
        /// Creates a list of objects based on rows returned from a data reader.
        /// </summary>
        /// <typeparam name="T">The class type for the list returned</typeparam>
        /// <param name="reader">An instance of IDataReader</param>
        private List<T> ConvertDataRow<T>(IDataReader reader) where T : new() {

            Type type = typeof(T);
            List<T> result = new List<T>();

            while (reader.Read()) {
                T obj = new T();
                for (int i = 0; i < reader.FieldCount; i++) {
                    SetTargetPropertyWithValue(
                        type.GetProperty(reader.GetName(i).Replace(" ", ""), BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase),
                        obj,
                        reader[i]);
                }
                result.Add(obj);
            }

            return result;
        }

        private void SetTargetPropertyWithValue(PropertyInfo prop, object target, object value) {
            if (prop != null) {
                int intValue;
                // SQL "bit" comes back as an int, so check to see if we need it to end up as a bool or bool? and cast accordingly
                if (Int32.TryParse(value.ToString(), out intValue) && IsPropertyBoolean(prop)) {
                    if (intValue != 0 && intValue != 1) {
                        throw new DataException(String.Format("Cannot convert {0} to bool", value));
                    }
                    prop.SetValue(target, intValue == 1);
                }
                // otherwise set our property value as normal
                else {
                    prop.SetValue(target, value is DBNull ? null : value);
                }
            }
        }

        private bool IsPropertyBoolean(PropertyInfo prop) {
            return
                // property is a boolean
                prop.PropertyType == typeof(bool)
                // property is generic, is nullable, and is a nullable<bool>
                || prop.PropertyType.IsGenericType && prop.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>) && prop.PropertyType.GetGenericArguments()[0] == typeof(bool);
        }
    }
}
