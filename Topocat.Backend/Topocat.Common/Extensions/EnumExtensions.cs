using System;
using System.Linq;

namespace Topocat.Common.Extensions
{
    public static class EnumExtensions
    {
        public static bool In<T>(this T @enum, params T[] values) where T: Enum
        {
            return values.Any(x => Equals(x, @enum));
        }
    }
}
