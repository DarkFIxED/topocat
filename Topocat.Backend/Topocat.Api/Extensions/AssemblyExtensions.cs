using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Topocat.API.Extensions
{
    public static class AssemblyExtensions
    {
        public static IEnumerable<Type> GetTypesWithAttribute<TAttribute>(this Assembly assembly) where TAttribute : Attribute
        {
            return assembly.GetTypes().Where(type => type.GetCustomAttributes(typeof(TAttribute), true).Length > 0);
        }
    }
}