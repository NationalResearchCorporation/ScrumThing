using System;

namespace ScrumThing.Web.Database {
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
}