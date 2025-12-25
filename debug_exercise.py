"""
调试练习案例 - Debug Exercise (已修复版本)
包含常见错误的修复示例和最佳实践
"""

from typing import List, Dict, Optional, Any


# ============ 案例 1: 语法错误 [已修复] ============
# 修复: 添加缺少的冒号
def calculate_average(numbers: List[float]) -> float:
    """计算列表平均值"""
    if not numbers:
        return 0.0
    total = 0.0
    for num in numbers:
        total += num
    return total / len(numbers)


# ============ 案例 2: 逻辑错误 [已修复] ============
# 修复: 使用第一个元素作为初始值，而不是 0
def find_max(numbers: List[float]) -> Optional[float]:
    """找出列表中的最大值"""
    if not numbers:
        return None
    max_val = numbers[0]  # 使用第一个元素作为初始值
    for num in numbers[1:]:
        if num > max_val:
            max_val = num
    return max_val


# ============ 案例 3: 索引越界错误 [已修复] ============
# 修复: 添加长度检查，使用切片
def get_last_three(items: List[Any]) -> List[Any]:
    """获取列表的最后三个元素"""
    return items[-3:] if items else []


# ============ 案例 4: 类型错误 [已修复] ============
# 修复: 使用 f-string 进行格式化
def concatenate_info(name: str, age: int) -> str:
    """拼接用户信息"""
    return f"Name: {name}, Age: {age}"


# ============ 案例 5: 除零错误 [已修复] ============
# 修复: 添加除零检查
def calculate_percentage(part: float, whole: float) -> float:
    """计算百分比"""
    if whole == 0:
        raise ValueError("分母不能为零")
    return (part / whole) * 100


# ============ 案例 6: 变量作用域错误 [已修复] ============
# 修复: 初始化 count 变量
def count_positives(numbers: List[float]) -> int:
    """统计正数个数"""
    count = 0  # 初始化变量
    for num in numbers:
        if num > 0:
            count += 1
    return count


# ============ 案例 7: 无限循环 [已修复] ============
# 修复: 添加递减语句
def countdown(n: int) -> None:
    """倒计时"""
    while n > 0:
        print(n)
        n -= 1  # 递减以避免无限循环


# ============ 案例 8: 键错误 [已修复] ============
# 修复: 使用 .get() 方法安全获取
def get_user_email(user_dict: Dict[str, Any]) -> Optional[str]:
    """获取用户邮箱"""
    return user_dict.get("email")


# ============ 案例 9: 可变默认参数陷阱 [已修复] ============
# 修复: 使用 None 作为默认值
def add_item(item: Any, items: Optional[List[Any]] = None) -> List[Any]:
    """向列表添加元素"""
    if items is None:
        items = []
    items.append(item)
    return items


# ============ 案例 10: 比较错误 [已修复] ============
# 修复: 使用 == 进行比较
def check_equal(a: Any, b: Any) -> bool:
    """检查两个值是否相等"""
    return a == b


# ============ 测试代码 ============
def run_tests() -> None:
    """运行所有测试用例"""
    print("=== 调试练习 - 修复后测试 ===\n")

    # 测试案例 1: 计算平均值
    print("案例1: calculate_average([1, 2, 3, 4, 5])")
    print(f"  结果: {calculate_average([1, 2, 3, 4, 5])}")
    print(f"  空列表: {calculate_average([])}")

    # 测试案例 2: 找最大值
    print("\n案例2: find_max([-5, -3, -1, -8])")
    print(f"  结果: {find_max([-5, -3, -1, -8])}")  # 预期: -1
    print(f"  空列表: {find_max([])}")

    # 测试案例 3: 获取最后三个元素
    print("\n案例3: get_last_three([1, 2])")
    print(f"  结果: {get_last_three([1, 2])}")  # [1, 2]
    print(f"  完整列表: {get_last_three([1, 2, 3, 4, 5])}")  # [3, 4, 5]

    # 测试案例 4: 拼接信息
    print("\n案例4: concatenate_info('Alice', 25)")
    print(f"  结果: {concatenate_info('Alice', 25)}")

    # 测试案例 5: 计算百分比
    print("\n案例5: calculate_percentage(50, 200)")
    print(f"  结果: {calculate_percentage(50, 200)}%")
    try:
        calculate_percentage(50, 0)
    except ValueError as e:
        print(f"  除零处理: {e}")

    # 测试案例 6: 统计正数
    print("\n案例6: count_positives([1, -2, 3, -4, 5])")
    print(f"  结果: {count_positives([1, -2, 3, -4, 5])}")  # 预期: 3

    # 测试案例 7: 倒计时
    print("\n案例7: countdown(3)")
    countdown(3)

    # 测试案例 8: 获取邮箱
    print("\n案例8: get_user_email")
    print(f"  有邮箱: {get_user_email({'email': 'test@example.com'})}")
    print(f"  无邮箱: {get_user_email({'name': 'Alice'})}")

    # 测试案例 9: 可变默认参数
    print("\n案例9: add_item (可变默认参数已修复)")
    print(f"  第一次调用: {add_item('a')}")  # ['a']
    print(f"  第二次调用: {add_item('b')}")  # ['b'] - 现在正确了!
    print(f"  第三次调用: {add_item('c')}")  # ['c']

    # 测试案例 10: 相等比较
    print("\n案例10: check_equal")
    print(f"  check_equal(1, 1): {check_equal(1, 1)}")
    print(f"  check_equal(1, 2): {check_equal(1, 2)}")

    print("\n=== 所有测试通过! ===")


if __name__ == "__main__":
    run_tests()
