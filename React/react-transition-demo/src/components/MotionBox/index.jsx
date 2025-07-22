import { motion } from "framer-motion";

const MotionBox = () => { 
    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{
                backgroundColor: 'skyblue',
                padding: 20,
            }}
        >
            <h1>Love Xiang</h1>
        </motion.div>
    )
}

export default MotionBox;