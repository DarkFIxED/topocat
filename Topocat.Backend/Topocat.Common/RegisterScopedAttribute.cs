using System;

namespace Topocat.Common
{
    [AttributeUsage(AttributeTargets.Class, Inherited = false)]
    public class RegisterScopedAttribute : Attribute
    {
        public RegisterScopedAttribute()
        {
            RegisteredToSelf = true;
        }

        public RegisterScopedAttribute(Type abstractionType)
        {
            RegisteredToSelf = false;
            AbstractionType = abstractionType;
        }

        public Type AbstractionType { get; protected set; }

        public bool RegisteredToSelf { get; protected set; }
    }
}