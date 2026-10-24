use core::fmt::Write;

const DECIMAL_BASE: u64 = 1_000_000_000;

/// Calculates `n!` directly as a decimal string, without a fixed size limit.
fn factorial_decimal(n: u32) -> String {
    // Base 1e9 limbs make decimal formatting inexpensive and exact.
    let mut limbs = vec![1_u32];

    for value in 2..=n {
        let mut carry = 0_u64;

        for limb in &mut limbs {
            let product = u64::from(*limb) * u64::from(value) + carry;
            *limb = (product % DECIMAL_BASE) as u32;
            carry = product / DECIMAL_BASE;
        }

        if carry != 0 {
            limbs.push(carry as u32);
        }
    }

    let mut result = limbs.last().unwrap().to_string();
    for limb in limbs[..limbs.len() - 1].iter().rev() {
        write!(&mut result, "{:09}", limb).unwrap();
    }
    result
}

/// Returns a packed UTF-8 result: byte length in the high 32 bits, pointer in the low 32 bits.
/// JavaScript must pass this value to `fac_free` after copying the bytes.
#[no_mangle]
pub extern "C" fn fac(n: u32) -> u64 {
    let bytes = factorial_decimal(n).into_bytes().into_boxed_slice();
    let len = bytes.len() as u32;
    let ptr = Box::into_raw(bytes) as *mut u8 as u32;
    (u64::from(len) << 32) | u64::from(ptr)
}

/// Releases a result allocated by `fac`.
///
/// # Safety
/// `packed` must be an unreleased value returned by `fac` from this module instance.
#[no_mangle]
pub unsafe extern "C" fn fac_free(packed: u64) {
    let ptr = (packed as u32) as *mut u8;
    let len = (packed >> 32) as usize;
    let slice = core::ptr::slice_from_raw_parts_mut(ptr, len);
    drop(Box::from_raw(slice));
}

#[cfg(test)]
mod tests {
    use super::factorial_decimal;

    #[test]
    fn calculates_factorials() {
        assert_eq!(factorial_decimal(0), "1");
        assert_eq!(factorial_decimal(1), "1");
        assert_eq!(factorial_decimal(5), "120");
        assert_eq!(factorial_decimal(12), "479001600");
        assert_eq!(factorial_decimal(13), "6227020800");
    }

    #[test]
    fn calculates_values_larger_than_64_bits() {
        assert_eq!(factorial_decimal(20), "2432902008176640000");
        assert_eq!(
            factorial_decimal(100),
            "93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000"
        );
    }
}
